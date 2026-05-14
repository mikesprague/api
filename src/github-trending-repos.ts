import { CheerioCrawler } from 'crawlee';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

import { sharedConfig, writeDataAsJsonFile } from './lib/helpers.js';
import type {
  TrendingRepo,
  TrendingRepoAPIResults,
  TrendingRepoConfig,
} from './lib/types.js';

import 'varlock/auto-load';

const { hrtime } = process;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(sharedConfig.defaultTimezone);

// set crawlee log level
// log.setLevel(LogLevel.DEBUG);

const debugStart = hrtime();

const config: TrendingRepoConfig = {
  urlToScrape: 'https://github.com/trending?spoken_language_code=en',
  fileName: 'index.json',
  ...sharedConfig,
};

const rowSelector = 'article.Box-row';
const linkTitleSelector = 'h2 > a';
const descriptionSelector = 'p';
const languageSelector = 'div.f6.color-fg-muted.mt-2';
const starsSelector = `${languageSelector} > a:nth-child(2)`;
const forksSelector = `${languageSelector} > a:nth-child(3)`;
const starsTodaySelector = `${languageSelector} > span.d-inline-block.float-sm-right`;
const languageColorSelector = `${languageSelector} > span.d-inline-block.ml-0.mr-3 > .repo-language-color`;
const languageNameSelector = `${languageSelector} > span.d-inline-block.ml-0.mr-3 > span:nth-child(2)`;

const trendingReposData: TrendingRepo[] = [];

const cheerioCrawler = new CheerioCrawler({
  maxRequestRetries: 3,
  async requestHandler({ request, $ }) {
    console.log(`[github-trending-repos] Processing ${request.url}`);

    $(rowSelector).each((i, elem) => {
      const title = $(elem).find(linkTitleSelector).attr('href')!.substring(1);
      const link = `https://github.com${$(elem)
        .find(linkTitleSelector)
        .attr('href')}`;
      const description = $(elem)
        .find(descriptionSelector)
        .text()
        .replace(/\r?\n|\r/, '')
        .trim();
      const forksLink = `https://github.com${$(elem)
        .find(forksSelector)
        .attr('href')}`;
      const starsLink = `https://github.com${$(elem)
        .find(starsSelector)
        .attr('href')}`;
      const stars = $(elem)
        .find(starsSelector)
        .text()
        .replace(/\r?\n|\r/, '')
        .trim();
      const forks = $(elem)
        .find(forksSelector)
        .text()
        .replace(/\r?\n|\r/, '')
        .trim();
      const starsToday = $(elem)
        .find(starsTodaySelector)
        .text()
        .replace(/\r?\n|\r/, '')
        .trim();
      const languageStyle = $(elem).find(languageColorSelector).attr('style')
        ? $(elem).find(languageColorSelector).attr('style')
        : undefined;
      const languageName = languageStyle
        ? $(elem)
            .find(languageNameSelector)
            .text()
            .replace(/\r?\n|\r/, '')
            .trim()
        : undefined;

      const trendingRepo: TrendingRepo = {
        title,
        description,
        stars,
        starsLink,
        forks,
        forksLink,
        starsToday,
        languageStyle,
        languageName,
        link,
      };
      trendingReposData.push(trendingRepo);
    });
  },
  failedRequestHandler({ request }) {
    console.log(`[national-day] Request ${request.url} failed.`);
  },
});

await cheerioCrawler.run([config.urlToScrape]);

const apiData: TrendingRepoAPIResults = {
  lastUpdated: dayjs().tz(config.defaultTimezone).toISOString(),
  data: trendingReposData,
};

await writeDataAsJsonFile(
  `${config.outputDir}github-trending-repos/`,
  config.fileName,
  apiData
);

console.log(apiData);

// output execution time
const debugEnd = hrtime(debugStart);
console.log(`Execution time: ${debugEnd[0] * 1000 + debugEnd[1] / 1000000}ms`);
