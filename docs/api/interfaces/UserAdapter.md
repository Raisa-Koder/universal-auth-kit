[**authjoy**](../README.md)

---

[authjoy](../README.md) / UserAdapter

# Interface: UserAdapter\<TUser\>

Defined in: [src/auth/adapters/user-adapter.ts:1](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/adapters/user-adapter.ts#L1)

## Type Parameters

### TUser

`TUser`

## Methods

### validateUser()

> **validateUser**(`identifier`, `secret`): `Promise`\<`TUser` \| `null`\>

Defined in: [src/auth/adapters/user-adapter.ts:2](https://github.com/kodeforgeX/Authjoy/blob/097214837c1009862ed784f7af8795796b3d324c/src/auth/adapters/user-adapter.ts#L2)

#### Parameters

##### identifier

`string`

##### secret

`string`

#### Returns

`Promise`\<`TUser` \| `null`\>
