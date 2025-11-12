[**@kodeforgex/authjoy**](../README.md)

---

[@kodeforgex/authjoy](../README.md) / RefreshAccessHandler

# Interface: RefreshAccessHandler\<TAccess, TRefresh\>

Defined in: [src/auth/capabilities/token/refresh-capability.ts:9](https://github.com/kodeforgeX/Authjoy/blob/cf4486079614c9dd907fbc93cafdb95c4a96bf30/src/auth/capabilities/token/refresh-capability.ts#L9)

## Type Parameters

### TAccess

`TAccess`

### TRefresh

`TRefresh`

## Methods

### refreshAccess()

> **refreshAccess**(`refreshToken`, `accessPayload`): `Promise`\<\{ `accessToken`: `string`; `refreshToken`: `string`; \}\>

Defined in: [src/auth/capabilities/token/refresh-capability.ts:10](https://github.com/kodeforgeX/Authjoy/blob/cf4486079614c9dd907fbc93cafdb95c4a96bf30/src/auth/capabilities/token/refresh-capability.ts#L10)

#### Parameters

##### refreshToken

`TRefresh`

##### accessPayload

`TAccess`

#### Returns

`Promise`\<\{ `accessToken`: `string`; `refreshToken`: `string`; \}\>
