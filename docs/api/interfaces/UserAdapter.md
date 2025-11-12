[**@kodeforgex/authjoy**](../README.md)

---

[@kodeforgex/authjoy](../README.md) / UserAdapter

# Interface: UserAdapter\<TUser\>

Defined in: [src/auth/adapters/user-adapter.ts:1](https://github.com/kodeforgeX/Authjoy/blob/b37313b44562648422bdce1d52ec0bfe19751bcd/src/auth/adapters/user-adapter.ts#L1)

## Type Parameters

### TUser

`TUser`

## Methods

### validateUser()

> **validateUser**(`identifier`, `secret`): `Promise`\<`TUser` \| `null`\>

Defined in: [src/auth/adapters/user-adapter.ts:2](https://github.com/kodeforgeX/Authjoy/blob/b37313b44562648422bdce1d52ec0bfe19751bcd/src/auth/adapters/user-adapter.ts#L2)

#### Parameters

##### identifier

`string`

##### secret

`string`

#### Returns

`Promise`\<`TUser` \| `null`\>
