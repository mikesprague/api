[api](../README.md) / github-trending-repos

# Module: github-trending-repos

## Table of contents

### Interfaces

- [TrendingRepoConfig](../interfaces/github_trending_repos.TrendingRepoConfig.md)

### Type Aliases

- [TrendingRepo](github_trending_repos.md#trendingrepo)
- [TrendingRepoResults](github_trending_repos.md#trendingreporesults)

## Type Aliases

### TrendingRepo

Ƭ **TrendingRepo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `description` | `string` |
| `forks` | `string` |
| `forksLink` | `string` |
| `languageName` | [`StringOrUndefined`](lib_helpers.md#stringorundefined) |
| `languageStyle` | [`StringOrUndefined`](lib_helpers.md#stringorundefined) |
| `link` | `string` |
| `stars` | `string` |
| `starsLink` | `string` |
| `starsToday` | `string` |
| `title` | `string` |

#### Defined in

[github-trending-repos.ts:21](https://github.com/mikesprague/api/blob/ff921ac/src/github-trending-repos.ts#L21)

___

### TrendingRepoResults

Ƭ **TrendingRepoResults**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | [`TrendingRepo`](github_trending_repos.md#trendingrepo)[] |
| `lastUpdated` | `string` |

#### Defined in

[github-trending-repos.ts:34](https://github.com/mikesprague/api/blob/ff921ac/src/github-trending-repos.ts#L34)
