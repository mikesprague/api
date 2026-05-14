export type StringOrNull = string | null;

export interface SharedConfig {
  defaultTimezone: string;
  userAgent: string;
  outputDir: string;
}

export type APIResults<T> = {
  data: T[];
  lastUpdated: string;
};

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

export type TrendingRepoAPIResults = {
  data: TrendingRepo[];
  lastUpdated: string;
};
