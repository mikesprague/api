import { SharedConfig, StringOrNull } from './lib/helpers.js';
export type NationalDay = {
    title: string;
    link: string;
    description: string;
    image?: StringOrNull;
};
export interface NationalDayConfig extends SharedConfig {
    urlToScrape: string;
    selectors: {
        days: string;
        title: string;
        link: string;
        image: string;
        description: {
            container: string;
            text: string;
        };
    };
    fileName: string;
}
