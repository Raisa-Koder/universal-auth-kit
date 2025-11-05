## Version 0 (v0) Design Document

### Overview

The core of the library is composed of:

- **Capability Interfaces:** Small, focused interfaces such as `CredentialLogin`, `TokenValidator`, `TokenIssuer`.
- **Strategies:** Concrete implementations of capabilities, e.g., `JWTEmailPasswordStrategy`.
- **AuthKernel:** A lightweight registry and delegator that holds strategy instances and exposes their capabilities in a type-safe way.

### Folder & File Structure

```text
src/
├── auth/
│   ├── kernel/
│   │   ├── AuthKernel.ts           # Generic strategy container
│   │   └── StrategyMap.ts          # Strategy type definitions
│   ├── capabilities/
│   │   ├── core/
│   │   │   ├── LoginCapability.ts
│   │   │   ├── ValidateCapability.ts
│   │   │   └── IssueCapability.ts
│   │   ├── token/
│   │   │   ├── RefreshCapability.ts
│   │   │   ├── RevokeCapability.ts
│   │   │   └── InvalidateCapability.ts
│   │   └── otp/
│   │       ├── VerifyOTPCapability.ts
│   │       └── ResendOTPCapability.ts
│   ├── credentials/
│   │   ├── JWTCredentials.ts
│   │   ├── GoogleOAuthCredentials.ts
│   │   └── MagicLinkCredentials.ts
│   ├── strategies/
│   │   ├── JWTEmailPasswordStrategy.ts
│   │   ├── GoogleOAuthStrategy.ts
│   │   └── MagicLinkStrategy.ts
│   ├── adapter/
│   │   ├── AuthAdapter.ts          # Interface
│   │   └── PrismaAuthAdapter.ts    # Implementation
│   ├── facade/
│   │   └── AuthFacade.ts
│   └── factory/
│       └── AuthKernelFactory.ts
```

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
or

```ts
// kernel.ts
import { AuthAdapter } from "./adapters/auth-adapter";
import { JWTEmailPasswordStrategy, JWTConfig } from "./strategies/jwt-strategy";
import { GoogleOAuthStrategy, GoogleConfig } from "./strategies/google-strategy";

const builtInStrategies = {
  jwt: JWTEmailPasswordStrategy,
  google: GoogleOAuthStrategy,
} as const;

type StrategyName = keyof typeof builtInStrategies;

// Map each strategy to its config type
type StrategyConfigMap = {
  jwt: JWTConfig;
  google: GoogleConfig;
};

// Map each strategy to its instance type
type StrategyInstanceMap = {
  [K in StrategyName]: InstanceType<typeof builtInStrategies[K]>;
};

export class AuthKernel<TUser, TStrategies extends Partial<StrategyConfigMap>> {
  private instances = new Map<StrategyName, any>();

  constructor(
    private adapter: AuthAdapter<TUser>,
    private strategies: TStrategies
  ) {}

  getStrategy<N extends keyof TStrategies>(name: N): StrategyInstanceMap[N] {
    if (this.instances.has(name as StrategyName)) {
      return this.instances.get(name as StrategyName);
    }

    const StrategyClass = builtInStrategies[name as StrategyName];
    if (!StrategyClass) throw new Error(`Unknown strategy: ${name}`);

    const config = this.strategies[name];
    if (!config) throw new Error(`No config provided for strategy: ${name}`);

    const instance = new StrategyClass(this.adapter, config);
    this.instances.set(name as StrategyName, instance);
    return instance;
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
or
```ts
const kernel = new AuthKernel(new AuthAdapter(), {
  jwt: { secret: "supersecret", algorithm: "HS256", payload: {} },
  google: { clientId: "xxx", clientSecret: "yyy", redirectUri: "http://localhost:3000/callback" },
});

const jwtStrategy = kernel.getStrategy("jwt");
await jwtStrategy.login({ email: "user@example.com", password: "password" });
```

### Benefits of This Design

- **No runtime if/else checks:** The type system ensures correct usage.

- **Easy to extend:** Add new strategies by implementing capabilities and registering them.

- **Separation of concerns:** Kernel doesn’t handle storage or transport.
