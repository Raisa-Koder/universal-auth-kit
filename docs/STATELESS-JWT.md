# Stateless JWT Strategy

## Overview

The `StatelessJWTStrategy` is a type-safe, configurable JWT handler for **issuing and validating tokens** in a stateless manner.  
It provides:

- Type-safe payload handling
- Centralized error handling
- Safe defaults for algorithm and expiration
- Easy integration with Node.js/TypeScript projects

---

## Installation

```bash
npm install jsonwebtoken
```

Or with Yarn:

```bash
yarn add jsonwebtoken
```

> Note: jsonwebtoken is required by the strategy.

## Configuration

```ts
export type JwtAlgorithm =
  | "HS256"
  | "HS384"
  | "HS512"
  | "RS256"
  | "RS384"
  | "RS512"
  | "ES256"
  | "ES384"
  | "ES512"
  | "PS256"
  | "PS384"
  | "PS512"
  | "none";

export interface JwtConfig {
  secret: string; // Required
  expiresIn?: string; // Optional, defaults to "1h"
  algorithm?: JwtAlgorithm; // Optional, defaults to "HS256"
}
```

---

### Default Behavior

- algorithm = "HS256" if not provided
- expiresIn = "1h" if not provided

---

### Creating the Strategy

```ts
import { StatelessJWTStrategy } from "../strategies/stateless-jwt.strategy";

const strategy = new StatelessJWTStrategy({
  secret: process.env.JWT_SECRET!,
  algorithm: "HS512", // optional
  expiresIn: "2h", // optional
});
```

---

### Generating a Token

```ts
const payload = { sub: "user123", role: "admin" };
const token = strategy.generateToken(payload);
console.log(token);
```

- Returns a JWT signed with the configured secret and algorithm.
- Uses expiresIn if provided, otherwise defaults to "1h".

---

### Validating a Token

```ts
try {
  const decodedPayload = await strategy.validateToken(token);
  console.log(decodedPayload);
} catch (err) {
  console.error(err);
}
```

- Returns the payload exactly as returned by jwt.verify().
- Throws centralized errors for failures.

---

### JWT Error Handling

Custom error classes:

- Error Class When Triggered
  - `JWTExpiredError` Token has expired
  - `JWTInvalidError` Token signature invalid or malformed
  - `JWTSignError` Signing token failed
  - `JWTUnknownErro`r Any other JWT-related error

---

### Example:

```ts
try {
  const payload = await strategy.validateToken(token);
} catch (err) {
  if (err instanceof JWTExpiredError) console.warn("Token expired!");
  else if (err instanceof JWTInvalidError) console.warn("Invalid token!");
  else console.error("Unexpected JWT error:", err);
}
```

---

### Type Safety

- TPayload generic ensures returned payload types are consistent.
- generateToken(payload: TPayload) accepts only the expected payload type.
- validateToken(token: string) returns the same type as jwt.verify() output.

---

### Edge Cases & Notes

- No expiration (expiresIn)
  - Token will be permanent if explicitly set to undefined.
  - Default is "1h" for security.
    -Algorithm mismatch
- Signing and verification always use the configured algorithm.
- Prevents accidental JWT bypasses.
- Unknown errors
  - Wrapped in JWTUnknownError to maintain consistent error handling.
- Recommended Workflow
  - Initialize the strategy with safe defaults.
  - Use `generateToken()` for signing payloads.
  - Use `validateToken()` to verify tokens.
- Catch specific JWT errors for proper handling.

---

### Full Example

```ts
import { StatelessJWTStrategy } from "../strategies/stateless-jwt.strategy";
import { JWTExpiredError, JWTInvalidError } from "../errors/jwt-errors";

const strategy = new StatelessJWTStrategy({
  secret: "my-secret",
});

const token = strategy.generateToken({ sub: "42", role: "user" });

try {
  const payload = await strategy.validateToken(token);
  console.log("Payload:", payload);
} catch (err) {
  if (err instanceof JWTExpiredError) console.log("Please login again");
  else if (err instanceof JWTInvalidError) console.log("Token invalid");
  else console.error("Unexpected JWT error:", err);
}
```

---

> Notes
>
> - Always set a secure secret for signing tokens.
> - Avoid algorithm = "none" in production.
> - Handle errors gracefully to avoid exposing sensitive information.
