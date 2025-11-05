import { JwtPayload } from "jsonwebtoken";
import { StatelessJWTStrategy } from "../base/stateless-jwt-strategy";
import { CredentialAuthenticator } from "@/src/auth/capabilities/core/authenticate-capability";
import { UserAdapter } from "@/src/auth/adapters/user-adapter";
import { InvalidCredentialsError } from "../base/errors";
import { CredentialBoundJWTCredentials, CredentialBoundJWTResult } from "../base/types";

/**
 * Credential-bound JWT strategy that delegates authentication to a user adapter.
 * 
 * Why: This keeps the JWT layer minimal and generic.
 * The strategy only signs whatever the adapter returns + optional runtime claims.
 */
export class CredentialBoundJWTStrategy<
  TUser extends { id: string;[key: string]: any } = any,
  TPayload extends JwtPayload = JwtPayload
> extends StatelessJWTStrategy<TPayload>
  implements CredentialAuthenticator<
    CredentialBoundJWTCredentials,
    CredentialBoundJWTResult<TUser>
  > {
  constructor(
    config: unknown,
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
    credentials: {
      identifier: string,
      password: string,
      runtimeClaims?: Record<string, any>
    }
  ): Promise<{ token: string; user: TUser }> {
    const { identifier, password, runtimeClaims } = credentials;

    const user = await this.userAdapter.validateUser(identifier, password);
    if (!user) throw new InvalidCredentialsError();

    // Why: Only include fields explicitly returned by the adapter + runtime claims.
    const tokenPayload: Partial<TPayload> = {
      ...user,
      ...runtimeClaims,
    } as unknown as Partial<TPayload>;

    const token = this.generateToken(tokenPayload as TPayload);

    return { token, user };
  }
}
