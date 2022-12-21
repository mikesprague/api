import cheerio from 'cheerio';
import dayjs from 'dayjs';
import got from 'got';

import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import { writeDataAsJsonFile, sharedConfig } from './lib/helpers.js';

const defaultTimezone = 'America/New_York';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(defaultTimezone);

const { hrtime } = process;

interface ApiResult {
  title: string;
  description: string;
  stars: string;
  starsLink: string;
  forks: string;
  forksLink: string;
  starsToday: string;
  languageStyle: string | undefined;
  languageName: string | undefined;
  link: string;
}

(async () => {
  const debugStart = hrtime();

  const config = {
    urlToScrape: 'https://github.com/trending?spoken_language_code=en',
    fileName: 'github-trending-repos.json',
  };

  const markup = await got
    .get(config.urlToScrape, {
      headers: {
        'User-Agent': sharedConfig.userAgent,
      },
    })
    .then((response) => response.body);
  const rowSelector = 'article.Box-row';
  const linkTitleSelector = 'h1 > a';
  const descriptionSelector = 'p';
  const languageSelector = 'div.f6.color-fg-muted.mt-2';
  const starsSelector = `${languageSelector} > a:nth-child(2)`;
  const forksSelector = `${languageSelector} > a:nth-child(3)`;
  const starsTodaySelector = `${languageSelector} > span.d-inline-block.float-sm-right`;
  const languageColorSelector = `${languageSelector} > span.d-inline-block.ml-0.mr-3 > .repo-language-color`;
  const languageNameSelector = `${languageSelector} > span.d-inline-block.ml-0.mr-3 > span:nth-child(2)`;
  const $ = cheerio.load(markup);
  const trendingReposData: ApiResult[] = [];

  $(rowSelector).each((i, elem) => {
    // @ts-ignore
    const title = $(elem).find(linkTitleSelector).attr('href').substring(1);
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

    const apiResult: ApiResult = {
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
    trendingReposData.push(apiResult);
  });

  const apiData = {
    lastUpdated: dayjs().tz(defaultTimezone).toISOString(),
    data: trendingReposData,
  };

  writeDataAsJsonFile(sharedConfig.outputDir, config.fileName, apiData);

  console.log(apiData);

  // output execution time
  const debugEnd = hrtime(debugStart);
  console.log(
    `Execution time: ${debugEnd[0] * 1000 + debugEnd[1] / 1000000}ms`,
  );
})();
