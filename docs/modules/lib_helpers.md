[api](../README.md) / lib/helpers

# Module: lib/helpers

## Table of contents

### Interfaces

- [SharedConfig](../interfaces/lib_helpers.SharedConfig.md)

### Type Aliases

- [StringOrUndefined](lib_helpers.md#stringorundefined)

### Variables

- [sharedConfig](lib_helpers.md#sharedconfig)

### Functions

- [writeDataAsJsonFile](lib_helpers.md#writedataasjsonfile)

## Type Aliases

### StringOrUndefined

Ƭ **StringOrUndefined**: `string` \| `undefined`

#### Defined in

[lib/helpers.ts:3](https://github.com/mikesprague/api/blob/ff921ac/src/lib/helpers.ts#L3)

## Variables

### sharedConfig

• `Const` **sharedConfig**: [`SharedConfig`](../interfaces/lib_helpers.SharedConfig.md)

#### Defined in

[lib/helpers.ts:37](https://github.com/mikesprague/api/blob/ff921ac/src/lib/helpers.ts#L37)

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

[lib/helpers.ts:23](https://github.com/mikesprague/api/blob/ff921ac/src/lib/helpers.ts#L23)
