# Extending Authjoy

You can create custom strategies by extending the `StatelessJwtStrategy` and implementing custom or present interfaces:

```ts
import { Strategy, AuthContext } from "authjoy";

class MyCustomStrategy
  extends StatelessJwtStrategy
  implements MyCustomInterface
{
  async authenticate(ctx: AuthContext) {
    // Your auth logic here
  }
}
```
