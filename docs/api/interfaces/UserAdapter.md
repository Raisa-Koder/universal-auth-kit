[**@kodeforgex/authjoy**](../README.md)

---

[@kodeforgex/authjoy](../README.md) / UserAdapter

# Interface: UserAdapter\<TUser\>

Defined in: [src/auth/adapters/user-adapter.ts:1](https://github.com/kodeforgeX/Authjoy/blob/80b2e2b883dba425c0722aa482e5007faaac7300/src/auth/adapters/user-adapter.ts#L1)

## Type Parameters

### TUser

`TUser`

## Methods

### validateUser()

> **validateUser**(`identifier`, `secret`): `Promise`\<`TUser` \| `null`\>

Defined in: [src/auth/adapters/user-adapter.ts:2](https://github.com/kodeforgeX/Authjoy/blob/80b2e2b883dba425c0722aa482e5007faaac7300/src/auth/adapters/user-adapter.ts#L2)

#### Parameters

##### identifier

`string`

##### secret

`string`

#### Returns

`Promise`\<`TUser` \| `null`\>
