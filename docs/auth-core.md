🧭 Guiding Principle

No config, only code.
Users explicitly instantiate, register, and wire everything.
Your library provides interfaces, composition, and orchestration — nothing more.

This makes your library:

Predictable — no hidden factory logic.

Extensible — users can subclass or replace any part.

Portable — works in any runtime (HTTP, gRPC, CLI, etc.).

Composable — users can assemble multiple kernels, contexts, and strategies.

🧱 Updated Architecture
src/
├── core/
│   ├── types.ts          # foundational contracts
│   ├── AuthKernel.ts     # registry for strategies/adapters/policies
│   ├── AuthContext.ts    # per-request/session runtime
│   └── errors.ts
│
├── strategies/
│   ├── PasswordStrategy.ts
│   ├── JWTStrategy.ts
│   └── index.ts
│
├── adapters/
│   ├── UserAdapter.ts
│   ├── TokenAdapter.ts
│   └── index.ts
│
├── policies/
│   ├── RBACPolicy.ts
│   └── index.ts
│
└── index.ts

🧩 Step 1 — Define Contracts (core/types.ts)

This file is the foundation of your whole library.
It describes what something must do, not how it’s done.

// src/core/types.ts

export interface User {
  id: string;
  [key: string]: any;
}

export interface AuthStrategy {
  /** Unique name of the strategy, e.g., "password", "jwt" */
  name: string;

  /** Authenticate using credentials (or token) and return a user */
  authenticate(credentials: Record<string, any>): Promise<User | null>;
}

export interface TokenStrategy {
  issue(user: User, options?: Record<string, any>): Promise<string>;
  verify(token: string): Promise<User | null>;
}

export interface Store<T> {
  get(id: string): Promise<T | null>;
  set(id: string, value: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface Authorizer {
  authorize(user: User, action: string, resource?: any): Promise<boolean>;
}

export interface KernelOptions {
  strategies?: Record<string, AuthStrategy>;
  adapters?: Record<string, Store<any>>;
  policies?: Record<string, Authorizer>;
}


Everything else you build will implement one or more of these contracts.

⚙️ Step 2 — AuthKernel (Registry + Orchestrator)
// src/core/AuthKernel.ts
import { AuthStrategy, Store, Authorizer, KernelOptions } from "./types";

export class AuthKernel {
  private strategies: Record<string, AuthStrategy> = {};
  private adapters: Record<string, Store<any>> = {};
  private policies: Record<string, Authorizer> = {};

  constructor(options?: KernelOptions) {
    if (options?.strategies) this.strategies = options.strategies;
    if (options?.adapters) this.adapters = options.adapters;
    if (options?.policies) this.policies = options.policies;
  }

  useStrategy(name: string, strategy: AuthStrategy) {
    this.strategies[name] = strategy;
    return this;
  }

  useAdapter(name: string, adapter: Store<any>) {
    this.adapters[name] = adapter;
    return this;
  }

  usePolicy(name: string, policy: Authorizer) {
    this.policies[name] = policy;
    return this;
  }

  getStrategy(name: string) {
    const strat = this.strategies[name];
    if (!strat) throw new Error(`Auth strategy "${name}" not registered`);
    return strat;
  }

  getPolicy(name = "default") {
    const policy = this.policies[name];
    if (!policy) throw new Error(`Policy "${name}" not registered`);
    return policy;
  }

  getAdapter(name: string) {
    const adapter = this.adapters[name];
    if (!adapter) throw new Error(`Adapter "${name}" not registered`);
    return adapter;
  }
}


✅ Purely composable, no magic config.
Users wire everything themselves via .useStrategy(), .useAdapter(), etc.

🧠 Step 3 — AuthContext (Runtime Layer)
// src/core/AuthContext.ts
import { AuthKernel } from "./AuthKernel";

export class AuthContext {
  private kernel: AuthKernel;
  private user: any = null;

  constructor(kernel: AuthKernel) {
    this.kernel = kernel;
  }

  async authenticate(strategyName: string, credentials: Record<string, any>) {
    const strat = this.kernel.getStrategy(strategyName);
    const user = await strat.authenticate(credentials);
    if (!user) throw new Error("Authentication failed");
    this.user = user;
    return user;
  }

  async authorize(action: string, resource?: any, policyName = "default") {
    if (!this.user) throw new Error("User not authenticated");
    const policy = this.kernel.getPolicy(policyName);
    return policy.authorize(this.user, action, resource);
  }

  getUser() {
    return this.user;
  }

  clear() {
    this.user = null;
  }
}

🚀 Step 4 — Example Usage
import { AuthKernel, AuthContext } from "universal-auth-kit/core";
import { PasswordStrategy } from "universal-auth-kit/strategies/PasswordStrategy";
import { JWTStrategy } from "universal-auth-kit/strategies/JWTStrategy";
import { RBACPolicy } from "universal-auth-kit/policies/RBACPolicy";
import { InMemoryStore } from "universal-auth-kit/adapters/MemoryStoreAdapter";

// 1. Compose the system explicitly
const kernel = new AuthKernel()
  .useStrategy("password", new PasswordStrategy({ hasher: "bcrypt" }))
  .useStrategy("jwt", new JWTStrategy({ secret: "top-secret" }))
  .useAdapter("user", new InMemoryStore())
  .useAdapter("token", new InMemoryStore())
  .usePolicy("default", new RBACPolicy({ admin: ["*"], user: ["read"] }));

// 2. Create a context for one request/session
const ctx = new AuthContext(kernel);

// 3. Run authentication/authorization
const user = await ctx.authenticate("password", { username: "alice", password: "123" });
if (await ctx.authorize("read")) {
  console.log("Access granted");
}


No config objects, no implicit behavior — just composable modules.

🔮 Optional Sugar Later (Not Now)

Once your core is stable, then you can add lightweight helpers:

composeAuthKernel({ useDefaults: true })

Or a factory that auto-loads strategies (for users who want less boilerplate).

But right now, you’re building the kernel — the part every other system can depend on.
