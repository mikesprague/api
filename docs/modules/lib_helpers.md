[api](../README.md) / lib/helpers

# Module: lib/helpers

## Table of contents

### Interfaces

- [SharedConfig](../interfaces/lib_helpers.SharedConfig.md)

### Type Aliases

- [APIResults](lib_helpers.md#apiresults)
- [StringOrNull](lib_helpers.md#stringornull)

### Variables

- [sharedConfig](lib_helpers.md#sharedconfig)

### Functions

- [writeDataAsJsonFile](lib_helpers.md#writedataasjsonfile)

## Type Aliases

### APIResults

Ƭ **APIResults**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `T`[] |
| `lastUpdated` | `string` |

#### Defined in

[lib/helpers.ts:11](https://github.com/mikesprague/api/blob/bb808e1/src/lib/helpers.ts#L11)

___

### StringOrNull

Ƭ **StringOrNull**: `string` \| ``null``

#### Defined in

[lib/helpers.ts:3](https://github.com/mikesprague/api/blob/bb808e1/src/lib/helpers.ts#L3)

## Variables

### sharedConfig

• `Const` **sharedConfig**: [`SharedConfig`](../interfaces/lib_helpers.SharedConfig.md)

#### Defined in

[lib/helpers.ts:42](https://github.com/mikesprague/api/blob/bb808e1/src/lib/helpers.ts#L42)

## Functions

### writeDataAsJsonFile

▸ **writeDataAsJsonFile**<`T`\>(`path`, `fileName`, `dataToWrite`): `Promise`<`void`\>

**`Summary`**

writes an object to a file as a string in JSON format

**`Example`**

```ts
await writeDataAsJsonFile(
  'outputDirectory/',
  'my-data.json',
  referenceToDataObject
);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `fileName` | `string` |
| `dataToWrite` | `T` |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/helpers.ts:28](https://github.com/mikesprague/api/blob/bb808e1/src/lib/helpers.ts#L28)
