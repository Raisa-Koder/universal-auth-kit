# 🔐 AuthKernel

> A lightweight, extensible **authentication & authorization kernel**.

**Philosophy:**  
🧩 The *kernel never changes* — only **strategies**, **policies**, and **adapters** extend it.  
It’s designed to be minimal, composable, and framework-agnostic.

---

## ✨ Features (Planned)

- ⚙️ **Pluggable Strategies** — Password, JWT, OAuth, or your custom ones  
- 🧠 **Flexible Policies** — RBAC, ABAC, or anything user-defined  
- 🧩 **Adapters (Future)**  
- 🪶 **Minimal Core** — The kernel dispatches only; no DB or state assumptions  
- 🔒 **Type-Safe Contracts** — Clear, composable interfaces for strategies, policies, and users  

---

## 📂 Project Structure

```text
src/
  core/
    AuthKernel.ts
    AuthContext.ts        // TBD: session/context layer
  contracts/
    AuthStrategy.ts
    Policy.ts
  types/
    User.ts
  strategies/
    password/PasswordStrategy.ts
    jwt/JwtStrategy.ts
  policies/
    RBACPolicy.ts
  adapters/
    MemoryAdapter.ts      // placeholder for future
  index.ts
```
## 🤝 Contributing
This project is in design stage. Contributions are welcome in the form of:
- Discussion on contracts and kernel design
- Proposals for strategies, policies, or adapters
- Documentation improvements

📜 License
MIT


 
