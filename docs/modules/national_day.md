[api](../README.md) / national-day

# Module: national-day

## Table of contents

### Interfaces

- [NationalDayConfig](../interfaces/national_day.NationalDayConfig.md)

### Type Aliases

- [NationalDay](national_day.md#nationalday)
- [NationalDayResults](national_day.md#nationaldayresults)

## Type Aliases

### NationalDay

Ƭ **NationalDay**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `description` | `string` |
| `image` | [`StringOrUndefined`](lib_helpers.md#stringorundefined) |
| `link` | `string` |
| `title` | `string` |

#### Defined in

[national-day.ts:21](https://github.com/mikesprague/api/blob/72247bf/src/national-day.ts#L21)

___

### NationalDayResults

Ƭ **NationalDayResults**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | [`NationalDay`](national_day.md#nationalday)[] |
| `lastUpdated` | `string` |

#### Defined in

[national-day.ts:28](https://github.com/mikesprague/api/blob/72247bf/src/national-day.ts#L28)
