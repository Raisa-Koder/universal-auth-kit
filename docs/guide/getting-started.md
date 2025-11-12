# Getting Started

## Installation

```bash
pnpm add authjoy
```

### Quick Example

```ts
import { StatelessJWTStrategy } from "@kodeforgex/authjoy";

const jwtStrategy = new StatelessJWTStrategy({
  secret: "supersecret",
  algorithm: "RS256",
  expiresIn: "1h",
  issuer: "authjoy",
  audience: "my-app",
});

// Generate a token
const token = jwtStrategy.generateToken({ userId: 123, role: "admin" });

// Validate it later
const payload = await jwtStrategy.validateToken(token);
console.log(payload.userId); // 123
```
