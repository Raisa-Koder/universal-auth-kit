import { StatelessJWTStrategy } from "../base/StatelessJWTStrategy";
import { JwtPayload } from "jsonwebtoken";
import { JwtConfig } from "../jwt.config";
import { UserAdpter } from "../../adapters/user-adapter";
import { InvalidCredentialsError } from "../base/errors";
import { CredentialAuthenticator } from "../../capabilities/core/authenticate-capability";

/**
 * Credential-bound JWT strategy that delegates authentication to a user adapter.
 * 
 * Why: This keeps the JWT layer minimal and generic.
 * The strategy only signs whatever the adapter returns + optional runtime claims.
 */
export class CredentialBoundJWTStrategy<
  TUser extends { id: string; [key: string]: any } = any,
  TPayload extends JwtPayload = JwtPayload
> extends StatelessJWTStrategy<TPayload> 
  implements CredentialAuthenticator<
  { identifier: string; secret: string; runtimeClaims?: Record<string, any> },
  { token: string; user: TUser }
> {
  constructor(
    config: JwtConfig,
    private userAdapter: UserAdapter<TUser>
  ) {
    super(config);
  }

  /**
   * Authenticate a user and generate a JWT.
   * 
   * Why: We trust the adapter to determine what belongs in the JWT payload.
   * runtimeClaims are optional, per-request flags or temporary info.
   */
  async authenticate(
    credentials: {identifier: string,
    secret: string,
    runtimeClaims?: Record<string, any>}
  ): Promise<{ token: string; user: TUser }> {
    const { identifier, secret, runtimeClaims } = credentials;
    
    const user = await this.userAdapter.validateUser(identifier, secret);
    if (!user) throw new InvalidCredentialsError();

    // Why: Only include fields explicitly returned by the adapter + runtime claims.
    const tokenPayload: Partial<TPayload> = {
      ...user,
      ...runtimeClaims,
    };

    const token = this.generateToken(tokenPayload as TPayload);

    return { token, user };
  }
}
