# Authjoy

> **Lightweight, modular, and extendable authentication strategies for Node.js**

[![Build](https://github.com/kodeforgeX/Authjoy/actions/workflows/ci.yml/badge.svg)](https://github.com/kodeforgeX/Authjoy/actions)
[![Docs](https://img.shields.io/badge/docs-typedoc-blue)](https://kodeforgex.github.io/Authjoy/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Authjoy provides a clean and extensible foundation for handling authentication in your applications.  
It’s built around **modular strategies**, designed to separate authentication concerns from business logic, while staying framework-agnostic and strongly typed.

> ⚠️ **Status:** Experimental (v0)  
> The kernel system is planned for later versions.  
> For now, each strategy can be used independently.

---

## ✨ Features

- ✅ Stateless, modular authentication strategies  
- 🔐 Strongly typed with TypeScript  
- ⚙️ Framework-agnostic design  
- 🧩 Easy to extend with custom strategies  
- 🧪 CI/CD with Vitest for automated testing  
- 🧱 Clean code style via ESLint + Prettier  
- 📘 Full [TypeDoc documentation](https://kodeforgex.github.io/Authjoy/)

---

## 📦 Installation

> The package is not yet published on npm.  
> Clone or install it locally until release.
```bash
# Clone the repository
git clone https://github.com/kodeforgeX/Authjoy.git

# Navigate to the project
cd Authjoy

# Install dependencies
pnpm install
```

### Once published:
```bash
npm install authjoy
```

---

## 🚀 Quick Start
Stateless JWT Strategy
Issue and validate JWTs without session storage.
```ts
import { StatelessJWTStrategy } from 'authjoy';

const jwtStrategy = new StatelessJWTStrategy({
  secret: 'supersecret',
  algorithm: 'RS256',
  expiresIn: '1h',
  issuer: 'authjoy',
  audience: 'my-app',
});

// Generate a token
const token = jwtStrategy.generateToken({ userId: 123, role: 'admin' });

// Validate it later
const payload = await jwtStrategy.validateToken(token);
console.log(payload.userId); // 123
Credential-Bound JWT Strategy
Authenticate users with credentials, then issue a token bound to them.
```
```ts
import { CredentialBoundJWTStrategy } from 'authjoy';

const cbJwtStrategy = new CredentialBoundJWTStrategy({
  secret: 'supersecret',
  algorithm: 'RS256',
  expiresIn: '1h',
});

await cbJwtStrategy.login({
  identifier: 'user@example.com',
  password: 'password123',
});
Stateless Refreshable JWT Strategy
Generate short-lived access tokens with refresh tokens for longer sessions.
```
```ts
import { StatelessRefreshableJWTStrategy } from 'authjoy';

const refreshable = new StatelessRefreshableJWTStrategy({
  secret: 'supersecret',
  algorithm: 'RS256',
  expiresIn: '15m',
  refreshExpiresIn: '7d',
});

const { accessToken, refreshToken } = refreshable.generateToken({
  userId: 456,
});

const payload = await refreshable.validateToken(accessToken);
```

---


## 🧠 Design Philosophy
Authjoy is built on the principle of strategy-based modularity:
- Each authentication method (JWT, OAuth, API key, etc.) is encapsulated in its own strategy.
- Strategies can be composed, swapped, or extended without coupling to business logic.
- This keeps authentication isolated, testable, and reusable across projects.
- The AuthKernel will be introduced in future versions to manage multiple strategies centrally.
- For now, each strategy is standalone.

---


## 🧩 Architecture Diagram
Below is a high-level representation of the current structure and the future kernel integration.

```markdown
                ┌──────────────────────────┐
                │        Authjoy v0        │
                │ (Independent Strategies) │
                └────────────┬─────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌────────────────┐   ┌────────────────────┐   ┌────────────────────────┐
│ StatelessJWT   │   │ CredentialBoundJWT │   │ StatelessRefreshableJWT│
│  Strategy       │   │  Strategy          │   │  Strategy              │
└────────────────┘   └────────────────────┘   └────────────────────────┘

                             ▼
                ┌──────────────────────────┐
                │     (Future) AuthKernel   │
                │  Manages multiple strategies │
                └──────────────────────────┘
```


---


## 🧩 API Documentation
### Full API documentation (TypeDoc):
👉 [kodeforgex.github.io/Authjoy](https://kodeforgex.github.io/Authjoy/)

### Includes:
- Class references (StatelessJWTStrategy, CredentialBoundJWTStrategy, etc.)
- Configuration schema
- Type definitions (JwtPayload, etc.)
- Example workflows


---


## 🔮 Roadmap
| Version | Focus                                      | Status      |
|---------|-------------------------------------------|------------|
| v0      | Independent JWT strategies                | ✅ Active   |
| v1      | Introduce kernel for multi-strategy orchestration | ⏳ Planned |
| v2      | Add OAuth, session, API key strategies    | ⏳ Planned |
| v3      | Middleware helpers, adapters, logging    | ⏳ Planned |
| v4      | Stable release with tests, examples, and benchmarks | ⏳ Planned |


---


## 🧪 Development & Testing
Run tests locally using Vitest:

```bash
pnpm run test
Lint and format code:
```
```bash
pnpm run lint
pnpm run format
```
Run type checks:
```bash
pnpm run typecheck
```


---


## ⚙️ Continuous Integration
Authjoy uses GitHub Actions for automated:
- Linting and formatting
- TypeScript builds
- Vitest test suite

All pull requests are validated via CI before merge.


---


## ⚠️ Security Notes
- Stateless tokens cannot be revoked server-side; consider short expiry or blacklists.
- Always validate algorithms and keys.
- Use HTTPS in production.
- Rotate keys regularly for RS256 / ES256.


---


## 🤝 Contributing
Contributions are welcome!

### Workflow
- Fork the repository
- Create a feature branch

```bash
git checkout -b feature/my-feature
Run tests & checks
```
```bash
pnpm run verify
```
- Commit & push
- Open a Pull Request

### Code Style
- TypeScript strict mode
- Enforced with ESLint + Prettier
= PRs must pass all CI checks before merge


---


## 📜 License
Licensed under the MIT License — see LICENSE for details.


---


## 🧭 Project Structure (v0)
```text
Authjoy/
│
├── src/
|   ├── auth/
│   │   ├── strategies/
|   |   |   └──  jwt/
|   |   |       ├── base/
│   │   │       |   ├── StatelessJWTStrategy.ts
|   |   |       |   ├── errors.ts
|   |   |       |   └── types.ts
|   |   |       ├── extensions
|   |   │       │   ├── CredentialBoundJWTStrategy.ts
|   |   │       │   └── StatelessRefreshableJWTStrategy.ts
|   |   |       └── index.ts
|   |   ├── adapters
|   |   |   ├── (files)
|   |   |   └── index.ts
|   |   ├── capabilities
|   |   |   ├── ...
|   |   |   └── index.ts
|   |   └── index.ts
│   └── index.ts
│
├── tests/
│   └── units/
|       └── auth/
│
├── docs/  (generated via TypeDoc)
├── package.json
├── tsconfig.json
└── README.md
```
> 💡 Example Use Cases
- API authentication using JWTs
- Server-to-server communication
- Stateless microservice authentication
- Building a custom auth system from composable strategies


---


## 🧾 Credits
- Developed and maintained by KodeforgeX
- Documentation powered by TypeDoc
