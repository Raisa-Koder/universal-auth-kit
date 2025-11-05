# Authjoy – Kernel-Level Authentication Library 

**Status:** Experimental / v0 – minimal JWT strategy  

**A lightweight, modular authentication kernel for quick integration and prototyping, letting developers focus on project logic instead of reinventing authentication.**

---

## 🚀 Problem Statement

Many authentication libraries mix **core authentication** with **business logic**, making it difficult to:

- Quickly start new projects without rewriting auth  
- Add custom logic without entangling it with authentication  
- Maintain a clear separation of concerns  

**Authjoy** solves this by providing a **central kernel** to manage authentication strategies, keeping your projects clean and modular.

---

## 🎯 Goal

- Provide a **central kernel** to orchestrate multiple authentication strategies  
- Keep the library **lightweight, modular, and extendable**  
- Allow developers to **focus on business logic**, not authentication plumbing  

---

## ⚙️ Concept

**Kernel**  
- Core of the library, responsible for managing authentication strategies  
- Handles strategy registration and request authentication  

**Strategy**  
- Pluggable units (JWT, Google OAuth, etc.)  
- Implement `login` and/or `authenticate` methods  
- Can be registered to the kernel  

**Adapter-in-Kernel (v0)**  
- Experimental approach to centralize authentication management  
- Minimal implementation with a JWT strategy for demonstration  

---

## 💡 Minimal Example (v0)

```ts
import { AuthKernel, AuthAdapter } from './kernel'

// Initialize kernel with adapter and strategies
const kernel = new AuthKernel(new AuthAdapter(), {
  jwt: { 
    secret: "supersecret", 
    algorithm: "HS256",
    expiresIn: "1h",
    payload: { user_id: "#124" role: "admin" } 
  },
})

// Retrieve the JWT strategy
const jwtStrategy = kernel.getStrategy("jwt")

// Perform login
await jwtStrategy.login({
  identifier: "user@example.com",
  password: "password"
})
```
---

## 🛠 Current Status

- AuthKernel class implemented
- Minimal JWT strategy implemented
- Kernel + JWT strategy can authenticate requests in a basic way
- Focus: **proof-of-concept for modular authentication**

---

## 🗺 Roadmap

v0 (Current): Kernel + minimal JWT strategy (runnable) <br>
v1: Add more authentication strategies (session, OAuth, API key) <br>
v2: Optional middleware helpers and adapters <br> 
v3: Community contributions, logging, error handling <br>
v4: Stable version with tests, benchmarks, and examples <br>

---

## 📈 Why Use Authjoy?

- Avoid repeating authentication logic across projects
- Focus on project-specific business logic
- Lightweight, modular, and easy to extend
- Framework-agnostic: integrate in Node.js or other environments

---

## 🤝 Contributing

- Fork the repo
- Add new strategies or improve docs
- Submit a PR
- Label issues: good-first-issue, help-wanted

---

## 💌 Feedback & Discussions

- Even in this experimental stage, feedback is welcome:
  - Feature ideas, bug reports, or strategy requests: open an issue
  - Usage discussions and demo sharing: GitHub Discussions
