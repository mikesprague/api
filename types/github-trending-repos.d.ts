import { SharedConfig, StringOrUndefined } from './lib/helpers.js';
export type TrendingRepo = {
    title: string;
    description: string;
    stars: string;
    starsLink: string;
    forks: string;
    forksLink: string;
    starsToday: string;
    languageStyle: StringOrUndefined;
    languageName: StringOrUndefined;
    link: string;
};
export type TrendingRepoResults = {
    lastUpdated: string;
    data: TrendingRepo[];
};
export interface TrendingRepoConfig extends SharedConfig {
    urlToScrape: string;
    fileName: string;
}
