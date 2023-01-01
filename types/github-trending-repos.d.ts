import { SharedConfig, StringOrNull } from './lib/helpers.js';
export type TrendingRepo = {
    title: string;
    description: string;
    stars: string;
    starsLink: string;
    forks: string;
    forksLink: string;
    starsToday: string;
    languageStyle?: StringOrNull;
    languageName?: StringOrNull;
    link: string;
};
export interface TrendingRepoConfig extends SharedConfig {
    urlToScrape: string;
    fileName: string;
}
