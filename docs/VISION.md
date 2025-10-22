# Universal Auth Kit

## Vision Document

### Purpose

Create a **transport-agnostic, storage-agnostic, pluggable authentication library** that:

- Supports multiple authentication strategies (JWT, OAuth, email/password, etc).
- Does not store user data or depend on any specific transport (HTTP, CLI, gRPC, etc).
- Provides a clean, composable, and type-safe interface for integrating authentication flows.
- Enables users to plug in custom strategies easily without changing the core.

### Core Principles

- **Capability-driven:** Strategies implement only the interfaces they need.
- **Type-safe:** Kernel returns fully typed strategy instances, eliminating runtime checks.
- **Lightweight kernel:** Acts as a registry and delegator, no heavy orchestration.
- **Extensible:** New strategies can be added without kernel modifications.
- **User-centric:** The host application manages transport and storage concerns.

### Target Users

- Developers building apps that require flexible authentication options.
- Framework and library authors who want an agnostic auth layer.
- Anyone wanting to separate auth logic from transport and persistence.

### Why This Is Important

- Avoids monolithic auth solutions tied to specific transports or storage.
- Encourages code reuse across projects with different auth needs.
- Simplifies testing and maintenance by isolating strategies.
