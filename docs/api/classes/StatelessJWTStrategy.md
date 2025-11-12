[**@kodeforgex/authjoy**](../README.md)

---

[@kodeforgex/authjoy](../README.md) / StatelessJWTStrategy

# Class: StatelessJWTStrategy\<TPayload\>

Defined in: [src/auth/strategies/jwt/base/stateless-jwt-strategy.ts:33](https://github.com/kodeforgeX/Authjoy/blob/80b2e2b883dba425c0722aa482e5007faaac7300/src/auth/strategies/jwt/base/stateless-jwt-strategy.ts#L33)

Provides a stateless JSON Web Token (JWT) authentication mechanism.

## Remarks

This strategy is intended for systems that do not persist session
state server-side. All token integrity and expiration are validated
using cryptographic signatures and standard JWT claims.

The class integrates both [TokenIssuer](../interfaces/TokenIssuer.md) and [TokenValidator](../interfaces/TokenValidator.md)
capabilities to issue and verify access tokens in a unified way.

Security goals:

- Enforce strong algorithms (RS256/ES256).
- Validate issuer and audience claims consistently.
- Fail fast on configuration or cryptographic misuse.

## Extended by

- [`CredentialBoundJWTStrategy`](CredentialBoundJWTStrategy.md)
- [`StatelessRefreshableJWTStrategy`](StatelessRefreshableJWTStrategy.md)

## Type Parameters

### TPayload

`TPayload` _extends_ `JwtPayload` = `JwtPayload`

The expected shape of the token payload.

## Implements

- [`TokenIssuer`](../interfaces/TokenIssuer.md)\<`TPayload`\>
- [`TokenValidator`](../interfaces/TokenValidator.md)\<`TPayload`\>

## Constructors

### Constructor

> **new StatelessJWTStrategy**\<`TPayload`\>(`rawConfig`): `StatelessJWTStrategy`\<`TPayload`\>

Defined in: [src/auth/strategies/jwt/base/stateless-jwt-strategy.ts:68](https://github.com/kodeforgeX/Authjoy/blob/80b2e2b883dba425c0722aa482e5007faaac7300/src/auth/strategies/jwt/base/stateless-jwt-strategy.ts#L68)

Creates a new stateless JWT strategy instance.

#### Parameters

##### rawConfig

`unknown`

Unvalidated configuration input.

#### Returns

`StatelessJWTStrategy`\<`TPayload`\>

#### Throws

Thrown when configuration validation fails.

#### Remarks

Configuration validation occurs immediately so that insecure
or incomplete settings cannot propagate to runtime.

## Properties

### config

> `protected` **config**: `object`

Defined in: [src/auth/strategies/jwt/base/stateless-jwt-strategy.ts:54](https://github.com/kodeforgeX/Authjoy/blob/80b2e2b883dba425c0722aa482e5007faaac7300/src/auth/strategies/jwt/base/stateless-jwt-strategy.ts#L54)

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

## Methods

### generateToken()

> **generateToken**(`payload`): `string`

Defined in: [src/auth/strategies/jwt/base/stateless-jwt-strategy.ts:89](https://github.com/kodeforgeX/Authjoy/blob/80b2e2b883dba425c0722aa482e5007faaac7300/src/auth/strategies/jwt/base/stateless-jwt-strategy.ts#L89)

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

#### Implementation of

[`TokenIssuer`](../interfaces/TokenIssuer.md).[`generateToken`](../interfaces/TokenIssuer.md#generatetoken)

---

### validateToken()

> **validateToken**(`token`): `Promise`\<`TPayload`\>

Defined in: [src/auth/strategies/jwt/base/stateless-jwt-strategy.ts:122](https://github.com/kodeforgeX/Authjoy/blob/80b2e2b883dba425c0722aa482e5007faaac7300/src/auth/strategies/jwt/base/stateless-jwt-strategy.ts#L122)

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

#### Implementation of

[`TokenValidator`](../interfaces/TokenValidator.md).[`validateToken`](../interfaces/TokenValidator.md#validatetoken)
