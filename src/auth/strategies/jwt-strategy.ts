import { AuthAdapter } from "../adapters/auth-adapter";
import { TokenIssuer } from "../capabilities/core/issue-capability";
import { CredentialLogin } from "../capabilities/core/login-capability";
import { TokenValidator } from "../capabilities/core/validate-capability";
import { JwtCredentials } from "../credentials/jwt-credentials";


export class JWTEmailPasswordStrategy<TUser>
  implements
    CredentialLogin<JwtCredentials, { token: string; user: TUser }>,
    TokenValidator<TUser>,
    TokenIssuer<TUser>
{
  constructor(
    private adapter: AuthAdapter<TUser>,
    private jwtSecret: string
  ) {}

  async login({identifier, password}: JwtCredentials) {
    let user = await this.adapter.findUserByEmail(identifier);
    if(!user) user = await this.adapter.findUserByUsername(identifier);
    if (!user) throw new Error("User not found");

    const valid = await this.adapter.validatePassword(user, password);
    if (!valid) throw new Error("Invalid credentials");

    const token = this.generateToken(user);
    return { token, user };
  }

  async validateToken(token: string) {
    // Verify JWT, return TUser
  }

  generateToken(user: TUser) {
    // Sign JWT with user info
  }
}