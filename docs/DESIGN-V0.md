## Version 0 (v0) Design Document

### Overview

The core of the library is composed of:

- **Capability Interfaces:** Small, focused interfaces such as `CredentialLogin`, `TokenValidator`, `TokenIssuer`.
- **Strategies:** Concrete implementations of capabilities, e.g., `JWTEmailPasswordStrategy`.
- **AuthKernel:** A lightweight registry and delegator that holds strategy instances and exposes their capabilities in a type-safe way.

### Capability Interfaces

```ts
interface CredentialLogin<TCredentials, TResult> {
  login(credentials: TCredentials): Promise<TResult>;
}

interface TokenValidator<TResult> {
  validateToken(token: string): Promise<TResult>;
}

interface TokenIssuer<TResult> {
  generateToken(payload: TResult): string;
}
```
### Example Strategy
```ts
class JWTEmailPasswordStrategy implements
  CredentialLogin<{ email: string; password: string }, { token: string; user: User }>,
  TokenValidator<User>,
  TokenIssuer<User>
{
  constructor(private userService: UserService, private jwtSecret: string) {}

  async login(credentials) {
    // Validate credentials and generate JWT token
  }

  async validateToken(token) {
    // Verify JWT and return user
  }

  generateToken(user) {
    // Create JWT token
  }
}
```
### AuthKernel
```ts
type StrategyMap = {
  jwt: JWTEmailPasswordStrategy;
  google: GoogleOAuthStrategy;
  // Add more strategies as needed
};

class AuthKernel<S extends StrategyMap> {
  constructor(private strategies: S) {}

  getStrategy<K extends keyof S>(name: K): S[K] {
    return this.strategies[name];
  }
}
```
### Usage Example
```ts
const kernel = new AuthKernel({
  jwt: new JWTEmailPasswordStrategy(userService, 'secret'),
  google: new GoogleOAuthStrategy(googleConfig),
});

const jwtStrategy = kernel.getStrategy('jwt');
const loginResult = await jwtStrategy.login({ email: 'user@example.com', password: 'password' });
```
### Benefits of This Design

- **No runtime if/else checks:** The type system ensures correct usage.

- **Easy to extend:** Add new strategies by implementing capabilities and registering them.

- **Separation of concerns:** Kernel doesn’t handle storage or transport.
