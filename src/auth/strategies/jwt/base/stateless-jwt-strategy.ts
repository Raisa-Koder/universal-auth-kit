import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenIssuer } from "../capabilities/core/issue-capability";
import { TokenValidator } from "../capabilities/core/validate-capability";
import { JwtConfig } from "../jwt.config";
import {
  JWTError,
  JWTExpiredError,
  JWTInvalidError,
  JWTSignError,
  JWTUnknownError,
} from "../errors";

/**
 * Stateless JWT strategy that both issues and validates JWT tokens.
 * 
 * @template TPayload - The expected shape of your JWT payload.
 *                      Defaults to JwtPayload from jsonwebtoken.
 */
export class StatelessJWTStrategy<TPayload extends JwtPayload = JwtPayload>
  implements TokenIssuer<string>, TokenValidator<TPayload>
{
  constructor(private config: JwtConfig) {}

  /**
   * Validate a JWT token and return the decoded payload.
   * Throws typed JWT errors on failure.
   */
  async validateToken(token: string): Promise<TPayload> {
    try {
      const algorithm = this.config.algorithm ?? "HS256";
      
      const decoded = jwt.verify(token, this.config.secret, {
        algorithms: [algorithm],
      });

      // jsonwebtoken can return either a string or an object
      if (typeof decoded === "string") {
        // We let it pass through for flexibility
        return { raw: decoded } as unknown as TPayload;
      }

      // Safely cast to TPayload
      return decoded as TPayload;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") throw new JWTExpiredError(err);
      if (err.name === "JsonWebTokenError") throw new JWTInvalidError(err);
      throw new JWTUnknownError(err);
    }
  }

  /**
   * Generate a signed JWT token from the given payload.
   * Returns a string token.
   * Throws a typed JWTSignError on failure.
   */
  generateToken(payload: TPayload): string {
    try {
       const algorithm = this.config.algorithm ?? "HS256";
       const expiresIn = this.config.expiresIn ?? "1h"; 

      const token = jwt.sign(payload, this.config.secret, {
        algorithm,
        expiresIn,
      });
      return token;
    } catch (err: any) {
      throw new JWTSignError(err);
    }
  }
}
