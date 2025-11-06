import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

import {
  RefreshAccessHandler,
  RefreshTokenIssuer,
  RefreshTokenValidator,
} from "@/src/auth/capabilities/token/refresh-capability";

import {
  JWTConfigError,
  JWTExpiredError,
  JWTInvalidError,
  JWTSignError,
} from "../base/errors";
import { StatelessJWTStrategy } from "../base/stateless-jwt-strategy";
import {
  RefreshTokenPayload,
  StatelessRefreshableJWTConfigSchema,
} from "../base/types";

/**
 * Stateless JWT strategy with refresh token support.
 *
 * Extends the base `StatelessJWTStrategy` to issue and validate
 * both access tokens and refresh tokens.
 *
 * @template TPayload - Type of the main access token payload
 */
export class StatelessRefreshableJWTStrategy<TPayload extends JwtPayload>
  extends StatelessJWTStrategy<TPayload>
  implements
    RefreshTokenValidator<RefreshTokenPayload>,
    RefreshTokenIssuer<string>,
    RefreshAccessHandler<string, TPayload>
{
  /** Secret used specifically for signing refresh tokens */
  protected refreshSecret: Secret;

  /** Expiration time for refresh tokens */
  protected refreshExpiresIn: string;

  /**
   * Initialize the strategy with configuration.
   *
   * Why: separating refresh and access token secrets ensures that
   * a compromise of one token type does not affect the other.
   */
  constructor(rawConfig: unknown) {
    const parsed = StatelessRefreshableJWTConfigSchema.safeParse(rawConfig);
    if (!parsed.success) {
      throw new JWTConfigError(parsed.error);
    }

    const config = parsed.data;

    super({
      secret: config.secret,
      algorithm: config.algorithm,
      issuer: config.issuer,
      audience: config.audience,
      expiresIn: config.expiresIn,
    });

    this.refreshSecret = config.refreshSecret;
    this.refreshExpiresIn = config.refreshExpiresIn;
  }

  /**
   * Generate a signed refresh token for a user.
   *
   * Why: refresh tokens require a distinct secret and expiration
   * to minimize risk if an access token is compromised. Casting
   * `expiresIn` ensures TypeScript compatibility.
   *
   * @param userId - The ID of the user to issue the refresh token for
   * @returns Signed JWT refresh token
   */
  generateRefreshToken(userId: string): string {
    try {
      const payload: RefreshTokenPayload = { sub: userId, type: "refresh" };
      const options: SignOptions = {
        algorithm: this.config.algorithm,
        expiresIn: this.refreshExpiresIn as SignOptions["expiresIn"],
      };
      return jwt.sign(payload, this.refreshSecret, options);
    } catch (error: unknown) {
      throw new JWTSignError(error as Error | undefined);
    }
  }

  /**
   * Validate a refresh token and ensure its type is correct.
   *
   * Why: refresh tokens are verified separately to enforce stricter
   * validation and reduce the chance of misuse.
   *
   * @param token - The refresh token to validate
   * @returns Decoded refresh token payload
   * @throws JWTExpiredError | JWTInvalidError
   */
  /* eslint-disable @typescript-eslint/require-await */
  async validateRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const decoded = jwt.verify(token, this.refreshSecret, {
        algorithms: [this.config.algorithm],
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      if (typeof decoded === "string") {
        throw new JWTInvalidError(new Error("Invalid refresh token payload"));
      }

      const payload = decoded as RefreshTokenPayload;

      return payload;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "TokenExpiredError")
          throw new JWTExpiredError(error);
        if (error.name === "JsonWebTokenError")
          throw new JWTInvalidError(error);
        throw error;
      }
      throw error;
    }
  }

  /**
   * Rotate tokens: generate a new access token and refresh token pair.
   *
   * Why: issuing fresh tokens ensures continuous session validity
   * while minimizing risk from long-lived tokens.
   *
   * @param accessPayload - Current access token payload
   * @param refreshToken - The existing refresh token to validate
   * @returns Object containing the new access token and refresh token
   */
  async refreshAccess(
    accessPayload: TPayload,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshPayload = await this.validateRefreshToken(refreshToken);

    const newAccessToken = this.generateToken(accessPayload);

    const newRefreshToken = this.generateRefreshToken(refreshPayload.sub);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
