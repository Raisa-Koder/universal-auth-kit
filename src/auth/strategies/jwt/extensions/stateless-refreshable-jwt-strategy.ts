import jwt, { JwtPayload } from "jsonwebtoken";
import {
  StatelessRefreshableJWTConfig,
  RefreshTokenPayload,
  AccessTokenPayload,
} from "../base/types";
import {
  JWTExpiredError,
  JWTInvalidError,
  JWTSignError,
} from "../base/errors";
import { RefreshTokenValidator, RefreshTokenIssuer, RefreshAccessHandler } from "../../capabilities/token/refresh-capability";
import { StatelessJWTStrategy } from ".../base/stateless-jwt-strategy";

export class StatelessRefreshableJWTStrategy<TPayload extends JwtPayload> extends StatelessJWTStrategy<TPayload>
  implements RefreshTokenValidator<RefreshTokenPayload>, RefreshTokenIssuer<string>, RefreshAccessHandler<TPayload, string>
{

  private refreshSecret: string;
  private refreshExpiresIn: string;

  constructor(config: StatelessRefreshableJWTConfig) {
    super({
      secret: config.secret, 
      expiresIn: config.expiresIn ?? "15m",
      algorithm: config.algorithm,
    });

    this.refreshSecret = config.refreshSecret;
    this.refreshExpiresIn = config.refreshExpiresIn ?? "7d";
  }

  generateRefreshToken(userId: string): string {
    try {
      const payload: RefreshTokenPayload = { sub: userId, type: "refresh" };
      return jwt.sign(payload, this.refreshSecret, {
        algorithm: this.algorithm,
        expiresIn: this.refreshExpiresIn,
      });
    } catch (err: any) {
      throw new JWTSignError(err);
    }
  }

  async validateRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const decoded = jwt.verify(token, this.refreshSecret, {
        algorithms: [this.algorithm],
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
   * Rotate tokens: generate new access & refresh token
   */
  async refreshAccess(
    accessPayload: TPayload,
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Validate the refresh token first
    const refreshPayload = await this.validateRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = this.generateToken(accessPayload);

    // Generate new refresh token using minimal payload
    const newRefreshToken = this.generateRefreshToken({
      sub: refreshPayload.sub,
      type: "refresh",
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
