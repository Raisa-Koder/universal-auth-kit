import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { JwtConfigSchema, JwtConfig } from "./types";
import {
  JWTConfigError,
  JWTExpiredError,
  JWTInvalidError,
  JWTSignError,
  JWTUnknownError,
} from "./errors";
import { TokenIssuer } from "@/src/auth/capabilities/core/issue-capability";
import { TokenValidator } from "@/src/auth/capabilities/core/validate-capability";

/**
 * Provides a stateless JSON Web Token (JWT) authentication mechanism.
 *
 * @remarks
 * This strategy is intended for systems that do not persist session
 * state server-side. All token integrity and expiration are validated
 * using cryptographic signatures and standard JWT claims.
 *
 * The class integrates both {@link TokenIssuer} and {@link TokenValidator}
 * capabilities to issue and verify access tokens in a unified way.
 *
 * Security goals:
 * - Enforce strong algorithms (RS256/ES256).
 * - Validate issuer and audience claims consistently.
 * - Fail fast on configuration or cryptographic misuse.
 *
 * @typeParam TPayload - The expected shape of the token payload.
 */
export class StatelessJWTStrategy<TPayload extends JwtPayload = JwtPayload>
  implements TokenIssuer<TPayload>, TokenValidator<TPayload> {
  /**
 * The validated JWT configuration accessible to subclasses.
 *
 * @protected
 * @remarks
 * Using `protected` instead of `private` allows derived strategies
 * (such as refreshable or hybrid JWT strategies) to reuse core
 * configuration values like {@link JwtConfig.algorithm | algorithm},
 * {@link JwtConfig.secret | secret}, and {@link JwtConfig.expiresIn | expiresIn}
 * without exposing them publicly.
 *
 * Why:
 * - Enables subclass extensions (e.g., refresh token support) to
 *   maintain consistency with the base configuration.
 * - Prevents code duplication and keeps configuration handling centralized.
 * - Keeps configuration hidden from external consumers while allowing
 *   controlled access within the inheritance hierarchy.
 */
  protected config: JwtConfig;

  /**
   * Creates a new stateless JWT strategy instance.
   *
   * @param rawConfig - Unvalidated configuration input.
   *
   * @throws {@link Error}
   * Thrown when configuration validation fails.
   *
   * @remarks
   * Configuration validation occurs immediately so that insecure
   * or incomplete settings cannot propagate to runtime.
   */
  constructor(rawConfig: unknown) {
    const parsed = JwtConfigSchema.safeParse(rawConfig);
    if (!parsed.success) {
      throw new JWTConfigError(parsed.error);
    }
    this.config = parsed.data;
  }

  /**
   * Generates a signed JWT access token.
   *
   * @param payload - The claims object to embed in the token.
   * @returns The signed JWT as a compact string.
   *
   * @throws {@link JWTSignError}
   * If the signing operation fails due to key or algorithm issues.
   *
   * @remarks
   * This method enforces explicit algorithms and registered claims
   * to maintain consistent identity boundaries across tokens.
   */
  generateToken(payload: TPayload): string {
    try {
      const options: SignOptions = {
        algorithm: this.config.algorithm,
        ...(this.config.issuer && { issuer: this.config.issuer }),
        ...(this.config.audience && { audience: this.config.audience }),
        expiresIn: this.config.expiresIn as SignOptions["expiresIn"]
      };
      return jwt.sign(payload, this.config.secret, options);
    } catch (err: any) {
      throw new JWTSignError(err);
    }
  }

  /**
   * Validates a provided JWT and returns its decoded payload.
   *
   * @param token - The JWT string to validate.
   * @returns The decoded payload if the token is valid.
   *
   * @throws {@link JWTExpiredError}
   * If the token is expired.
   * @throws {@link JWTInvalidError}
   * If the token is malformed or fails signature verification.
   * @throws {@link JWTUnknownError}
   * For unexpected verification errors.
   *
   * @remarks
   * Verification enforces algorithm, issuer, and audience consistency
   * to mitigate downgrade or replay attacks. Tokens represented as
   * strings are supported for legacy compatibility.
   */
  async validateToken(token: string): Promise<TPayload> {
    try {
      const decoded = jwt.verify(token, this.config.secret, {
        algorithms: [this.config.algorithm],
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      return decoded as TPayload;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") throw new JWTExpiredError(err);
      if (err.name === "JsonWebTokenError") throw new JWTInvalidError(err);
      throw new JWTUnknownError(err);
    }
  }
}
