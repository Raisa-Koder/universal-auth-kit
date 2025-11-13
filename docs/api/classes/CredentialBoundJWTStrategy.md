[**authjoy**](../README.md)

---

[authjoy](../README.md) / CredentialBoundJWTStrategy

# Class: CredentialBoundJWTStrategy\<TUser, TPayload\>

Defined in: [src/auth/strategies/jwt/extensions/credential-bound-jwt-strategy.ts:19](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/extensions/credential-bound-jwt-strategy.ts#L19)

Credential-bound JWT strategy that delegates authentication to a user adapter.

Why: This keeps the JWT layer minimal and generic.
The strategy only signs whatever the adapter returns + optional runtime claims.

## Extends

- [`StatelessJWTStrategy`](StatelessJWTStrategy.md)\<`TPayload`\>

## Type Parameters

### TUser

`TUser` _extends_ `object`

### TPayload

`TPayload` _extends_ `JwtPayload` = `JwtPayload`

## Implements

- [`CredentialAuthenticator`](../interfaces/CredentialAuthenticator.md)\<[`CredentialBoundJWTCredentials`](../interfaces/CredentialBoundJWTCredentials.md), [`CredentialBoundJWTResult`](../interfaces/CredentialBoundJWTResult.md)\<`TUser`\>\>

## Constructors

### Constructor

> **new CredentialBoundJWTStrategy**\<`TUser`, `TPayload`\>(`config`, `userAdapter`): `CredentialBoundJWTStrategy`\<`TUser`, `TPayload`\>

Defined in: [src/auth/strategies/jwt/extensions/credential-bound-jwt-strategy.ts:30](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/extensions/credential-bound-jwt-strategy.ts#L30)

#### Parameters

##### config

`unknown`

##### userAdapter

[`UserAdapter`](../interfaces/UserAdapter.md)\<`TUser`\>

#### Returns

`CredentialBoundJWTStrategy`\<`TUser`, `TPayload`\>

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

## Methods

### authenticate()

> **authenticate**(`credentials`): `Promise`\<\{ `token`: `string`; `user`: `TUser`; \}\>

Defined in: [src/auth/strategies/jwt/extensions/credential-bound-jwt-strategy.ts:43](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/strategies/jwt/extensions/credential-bound-jwt-strategy.ts#L43)

Authenticate a user and generate a JWT.

Why: We trust the adapter to determine what belongs in the JWT payload.
runtimeClaims are optional, per-request flags or temporary info.

#### Parameters

##### credentials

###### identifier

`string`

###### password

`string`

###### runtimeClaims?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<\{ `token`: `string`; `user`: `TUser`; \}\>

#### Implementation of

[`CredentialAuthenticator`](../interfaces/CredentialAuthenticator.md).[`authenticate`](../interfaces/CredentialAuthenticator.md#authenticate)

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
