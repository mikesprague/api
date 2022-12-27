[api](../README.md) / [national-day](../modules/national_day.md) / NationalDayConfig

# Interface: NationalDayConfig

[national-day](../modules/national_day.md).NationalDayConfig

## Hierarchy

- [`SharedConfig`](lib_helpers.SharedConfig.md)

  ↳ **`NationalDayConfig`**

## Table of contents

### Properties

- [defaultTimezone](national_day.NationalDayConfig.md#defaulttimezone)
- [fileName](national_day.NationalDayConfig.md#filename)
- [outputDir](national_day.NationalDayConfig.md#outputdir)
- [selectors](national_day.NationalDayConfig.md#selectors)
- [urlToScrape](national_day.NationalDayConfig.md#urltoscrape)
- [userAgent](national_day.NationalDayConfig.md#useragent)

## Properties

### defaultTimezone

• **defaultTimezone**: `string`

#### Inherited from

[SharedConfig](lib_helpers.SharedConfig.md).[defaultTimezone](lib_helpers.SharedConfig.md#defaulttimezone)

#### Defined in

[lib/helpers.ts:6](https://github.com/mikesprague/api/blob/ff921ac/src/lib/helpers.ts#L6)

___

### fileName

• **fileName**: `string`

#### Defined in

[national-day.ts:45](https://github.com/mikesprague/api/blob/ff921ac/src/national-day.ts#L45)

___

### outputDir

• **outputDir**: `string`

#### Inherited from

[SharedConfig](lib_helpers.SharedConfig.md).[outputDir](lib_helpers.SharedConfig.md#outputdir)

#### Defined in

[lib/helpers.ts:8](https://github.com/mikesprague/api/blob/ff921ac/src/lib/helpers.ts#L8)

___

### selectors

• **selectors**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `days` | `string` |
| `description` | { `container`: `string` ; `text`: `string`  } |
| `description.container` | `string` |
| `description.text` | `string` |
| `image` | `string` |
| `link` | `string` |
| `title` | `string` |

#### Defined in

[national-day.ts:35](https://github.com/mikesprague/api/blob/ff921ac/src/national-day.ts#L35)

___

### urlToScrape

• **urlToScrape**: `string`

#### Defined in

[national-day.ts:34](https://github.com/mikesprague/api/blob/ff921ac/src/national-day.ts#L34)

___

### userAgent

• **userAgent**: `string`

#### Inherited from

[SharedConfig](lib_helpers.SharedConfig.md).[userAgent](lib_helpers.SharedConfig.md#useragent)

#### Defined in

[lib/helpers.ts:7](https://github.com/mikesprague/api/blob/ff921ac/src/lib/helpers.ts#L7)
