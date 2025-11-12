[**@kodeforgex/authjoy**](../README.md)

---

[@kodeforgex/authjoy](../README.md) / RefreshAccessHandler

# Interface: RefreshAccessHandler\<TAccess, TRefresh\>

Defined in: [src/auth/capabilities/token/refresh-capability.ts:9](https://github.com/kodeforgeX/Authjoy/blob/80b2e2b883dba425c0722aa482e5007faaac7300/src/auth/capabilities/token/refresh-capability.ts#L9)

## Type Parameters

### TAccess

`TAccess`

### TRefresh

`TRefresh`

## Methods

### refreshAccess()

> **refreshAccess**(`refreshToken`, `accessPayload`): `Promise`\<\{ `accessToken`: `string`; `refreshToken`: `string`; \}\>

Defined in: [src/auth/capabilities/token/refresh-capability.ts:10](https://github.com/kodeforgeX/Authjoy/blob/80b2e2b883dba425c0722aa482e5007faaac7300/src/auth/capabilities/token/refresh-capability.ts#L10)

#### Parameters

##### refreshToken

`TRefresh`

##### accessPayload

`TAccess`

#### Returns

`Promise`\<\{ `accessToken`: `string`; `refreshToken`: `string`; \}\>
