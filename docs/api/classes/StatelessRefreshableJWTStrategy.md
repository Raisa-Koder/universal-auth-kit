[**authjoy**](../README.md)

---

[authjoy](../README.md) / StatelessRefreshableJWTStrategy

# Class: StatelessRefreshableJWTStrategy\<TPayload\>

Defined in: [src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts:29](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts#L29)

Stateless JWT strategy with refresh token support.

Extends the base `StatelessJWTStrategy` to issue and validate
both access tokens and refresh tokens.

## Extends

- [`StatelessJWTStrategy`](StatelessJWTStrategy.md)\<`TPayload`\>

## Type Parameters

### TPayload

`TPayload` _extends_ `JwtPayload`

Type of the main access token payload

## Implements

- [`RefreshTokenValidator`](../interfaces/RefreshTokenValidator.md)\<[`RefreshTokenPayload`](../interfaces/RefreshTokenPayload.md)\>
- [`RefreshTokenIssuer`](../interfaces/RefreshTokenIssuer.md)\<`string`\>
- [`RefreshAccessHandler`](../interfaces/RefreshAccessHandler.md)\<`string`, `TPayload`\>

## Constructors

### Constructor

> **new StatelessRefreshableJWTStrategy**\<`TPayload`\>(`rawConfig`): `StatelessRefreshableJWTStrategy`\<`TPayload`\>

Defined in: [src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts:48](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts#L48)

Initialize the strategy with configuration.

Why: separating refresh and access token secrets ensures that
a compromise of one token type does not affect the other.

#### Parameters

##### rawConfig

`unknown`

#### Returns

`StatelessRefreshableJWTStrategy`\<`TPayload`\>

#### Overrides

[`StatelessJWTStrategy`](StatelessJWTStrategy.md).[`constructor`](StatelessJWTStrategy.md#constructor)

## Properties

### config

> `protected` **config**: `object`

Defined in: [src/auth/strategies/jwt/base/stateless-jwt-strategy.ts:54](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/base/stateless-jwt-strategy.ts#L54)

The validated JWT configuration accessible to subclasses.

#### algorithm

> **algorithm**: `"RS256"` \| `"ES256"`

#### audience?

> `optional` **audience**: `string`

#### expiresIn

> **expiresIn**: `string` \| `number`

#### issuer?

> `optional` **issuer**: `string`

#### secret

> **secret**: `string`

#### Remarks

Using `protected` instead of `private` allows derived strategies
(such as refreshable or hybrid JWT strategies) to reuse core
configuration values like

- [JwtConfig](../type-aliases/JwtConfig.md) fields: algorithm, secret, expiresIn,
  without exposing them publicly.

Why:

- Enables subclass extensions (e.g., refresh token support) to
  maintain consistency with the base configuration.
- Prevents code duplication and keeps configuration handling centralized.
- Keeps configuration hidden from external consumers while allowing
  controlled access within the inheritance hierarchy.

#### Inherited from

[`StatelessJWTStrategy`](StatelessJWTStrategy.md).[`config`](StatelessJWTStrategy.md#config)

---

### refreshExpiresIn

> `protected` **refreshExpiresIn**: `string`

Defined in: [src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts:40](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts#L40)

Expiration time for refresh tokens

---

### refreshSecret

> `protected` **refreshSecret**: `Secret`

Defined in: [src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts:37](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts#L37)

Secret used specifically for signing refresh tokens

## Methods

### generateRefreshToken()

> **generateRefreshToken**(`userId`): `string`

Defined in: [src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts:78](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts#L78)

Generate a signed refresh token for a user.

Why: refresh tokens require a distinct secret and expiration
to minimize risk if an access token is compromised. Casting
`expiresIn` ensures TypeScript compatibility.

#### Parameters

##### userId

`string`

The ID of the user to issue the refresh token for

#### Returns

`string`

Signed JWT refresh token

#### Implementation of

[`RefreshTokenIssuer`](../interfaces/RefreshTokenIssuer.md).[`generateRefreshToken`](../interfaces/RefreshTokenIssuer.md#generaterefreshtoken)

---

### generateToken()

> **generateToken**(`payload`): `string`

Defined in: [src/auth/strategies/jwt/base/stateless-jwt-strategy.ts:89](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/base/stateless-jwt-strategy.ts#L89)

Generates a signed JWT access token.

#### Parameters

##### payload

`TPayload`

The claims object to embed in the token.

#### Returns

`string`

The signed JWT as a compact string.

#### Throws

If the signing operation fails due to key or algorithm issues.

#### Remarks

This method enforces explicit algorithms and registered claims
to maintain consistent identity boundaries across tokens.

#### Inherited from

[`StatelessJWTStrategy`](StatelessJWTStrategy.md).[`generateToken`](StatelessJWTStrategy.md#generatetoken)

---

### refreshAccess()

> **refreshAccess**(`accessPayload`, `refreshToken`): `Promise`\<\{ `accessToken`: `string`; `refreshToken`: `string`; \}\>

Defined in: [src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts:139](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts#L139)

Rotate tokens: generate a new access token and refresh token pair.

Why: issuing fresh tokens ensures continuous session validity
while minimizing risk from long-lived tokens.

#### Parameters

##### accessPayload

`TPayload`

Current access token payload

##### refreshToken

`string`

The existing refresh token to validate

#### Returns

`Promise`\<\{ `accessToken`: `string`; `refreshToken`: `string`; \}\>

Object containing the new access token and refresh token

#### Implementation of

[`RefreshAccessHandler`](../interfaces/RefreshAccessHandler.md).[`refreshAccess`](../interfaces/RefreshAccessHandler.md#refreshaccess)

---

### validateRefreshToken()

> **validateRefreshToken**(`token`): `Promise`\<[`RefreshTokenPayload`](../interfaces/RefreshTokenPayload.md)\>

Defined in: [src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts:102](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/extensions/stateless-refreshable-jwt-strategy.ts#L102)

Validate a refresh token and ensure its type is correct.

Why: refresh tokens are verified separately to enforce stricter
validation and reduce the chance of misuse.

#### Parameters

##### token

`string`

The refresh token to validate

#### Returns

`Promise`\<[`RefreshTokenPayload`](../interfaces/RefreshTokenPayload.md)\>

Decoded refresh token payload

#### Throws

JWTExpiredError | JWTInvalidError

#### Implementation of

[`RefreshTokenValidator`](../interfaces/RefreshTokenValidator.md).[`validateRefreshToken`](../interfaces/RefreshTokenValidator.md#validaterefreshtoken)

---

### validateToken()

> **validateToken**(`token`): `Promise`\<`TPayload`\>

Defined in: [src/auth/strategies/jwt/base/stateless-jwt-strategy.ts:122](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/base/stateless-jwt-strategy.ts#L122)

Validates a provided JWT and returns its decoded payload.

#### Parameters

##### token

`string`

The JWT string to validate.

#### Returns

`Promise`\<`TPayload`\>

The decoded payload if the token is valid.

#### Throws

If the token is expired.

#### Throws

If the token is malformed or fails signature verification.

#### Throws

For unexpected verification errors.

#### Remarks

Verification enforces algorithm, issuer, and audience consistency
to mitigate downgrade or replay attacks. Tokens represented as
strings are supported for legacy compatibility.

#### Inherited from

[`StatelessJWTStrategy`](StatelessJWTStrategy.md).[`validateToken`](StatelessJWTStrategy.md#validatetoken)
