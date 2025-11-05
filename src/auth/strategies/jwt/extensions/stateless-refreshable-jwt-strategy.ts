import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import {
  StatelessRefreshableJWTConfig,
  RefreshTokenPayload,
} from "../base/types";
import {
  JWTExpiredError,
  JWTInvalidError,
  JWTSignError,
} from "../base/errors";
import {
  RefreshAccessHandler,
  RefreshTokenIssuer,
  RefreshTokenValidator,
} from "@/src/auth/capabilities/token/refresh-capability";
import { StatelessJWTStrategy } from "../base/stateless-jwt-strategy";

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
  RefreshAccessHandler<string, TPayload> {
  /** Secret used specifically for signing refresh tokens */
  private refreshSecret: Secret;

  /** Expiration time for refresh tokens */
  private refreshExpiresIn: string;

  /**
   * Initialize the strategy with configuration.
   *
   * Why: separating refresh and access token secrets ensures that
   * a compromise of one token type does not affect the other.
   */
  constructor(config: StatelessRefreshableJWTConfig) {
    super({
      secret: config.secret,
      algorithm: config.algorithm,
      issuer: config.issuer,
      audience: config.audience,
      expiresIn: config.expiresIn,
    });

    this.refreshSecret = config.refreshSecret;
    this.refreshExpiresIn = config.refreshExpiresIn ?? "7d";
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
    } catch (err: any) {
      throw new JWTSignError(err);
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
  async validateRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const decoded = jwt.verify(token, this.refreshSecret, {
        algorithms: [this.config.algorithm ?? "HS256"],
        issuer: this.config.issuer,
        audience: this.config.audience,
      });


      if (typeof decoded === "string") {
        throw new JWTInvalidError(new Error("Invalid refresh token payload"));
      }

      const payload = decoded as RefreshTokenPayload;

      if (payload.type !== "refresh") {
        throw new JWTInvalidError(new Error("Not a refresh token"));
      }

      return payload;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") throw new JWTExpiredError(err);
      if (err.name === "JsonWebTokenError") throw new JWTInvalidError(err);
      throw err;
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
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshPayload = await this.validateRefreshToken(refreshToken);

    const newAccessToken = this.generateToken(accessPayload);

    const newRefreshToken = this.generateRefreshToken(refreshPayload.sub);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
