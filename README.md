# Universal Auth Kit

A framework-agnostic, strategy-based authentication library supporting JWT, sessions, OAuth, and more — designed to be transport and storage agnostic, pluggable, and type-safe.

---

## Installation

Install via npm:

```bash
npm install universal-auth-kit
```
or 
```yarn:
yarn add universal-auth-kit
```
### Usage Example
```ts
import { AuthKernel } from 'universal-auth-kit';
import { JWTEmailPasswordStrategy } from 'universal-auth-kit/strategies/jwtEmailPasswordStrategy';

// Initialize your user service and secret
const userService = new UserService();
const jwtSecret = 'your-secret-key';

// Instantiate your strategies
const jwtStrategy = new JWTEmailPasswordStrategy(userService, jwtSecret);

// Create the kernel and register strategies
const kernel = new AuthKernel({
  jwt: jwtStrategy,
});

// Use the JWT strategy
const jwt = kernel.getStrategy('jwt');
const loginResult = await jwt.login({ email: 'user@example.com', password: 'password' });

console.log(loginResult);
```
### Documentation
- [Vision Document](./docs/VISION.md)
- [Version 0 Design](./docs/DESIGN-V0.md)

### Contributing
Contributions, issues, and feature requests are welcome!
Please open issues or pull requests on GitHub.
