import { SharedConfig, StringOrNull } from './lib/helpers';
export type NationalDay = {
    title: string;
    link: string;
    image?: StringOrNull;
    description?: StringOrNull;
};
export interface NationalDayConfig extends SharedConfig {
    urlToScrape: string;
    selectors: {
        daysContainer: string;
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
