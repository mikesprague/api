import * as cheerio from 'cheerio';
import {
  CheerioCrawler,
  // log,
  // LogLevel,
  // PlaywrightCrawler,
} from 'crawlee';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

import {
  APIResults,
  SharedConfig,
  StringOrNull,
  sharedConfig,
  writeDataAsJsonFile,
} from './lib/helpers';

const { hrtime } = process;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(sharedConfig.defaultTimezone);

// log.setLevel(LogLevel.DEBUG);

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

const debugStart = hrtime();

const config: NationalDayConfig = {
  urlToScrape: `https://www.daysoftheyear.com/days/${
    dayjs().format('MMM').toLowerCase() === 'sep'
      ? 'sept'
      : dayjs().format('MMM').toLowerCase()
  }/${dayjs().format('DD')}/`,
  selectors: {
    daysContainer:
      'section:has(div.cards-grid.cards-grid--4) > div.cards-grid.cards-grid--4',
    days: 'article.card',
    title: '.card__content > h3',
    link: '.card__content > h3 > a',
    image: '.card__media img',
    description: {
      container: 'main#content',
      text: 'article.single__content > p',
    },
  },
  fileName: 'index.json',
  ...sharedConfig,
};

const nationalDaysData: NationalDay[] = [];

console.log(`[national-day] Scraping data from: ${config.urlToScrape}`);

const pageData: string = await fetch(config.urlToScrape, {
  headers: {
    'User-Agent': config.userAgent,
  },
})
  .then(async (response) => response.text())
  .catch((error) => {
    console.error('[national-day] Error: \n', error);
    return error;
  });

const $ = cheerio.load(pageData);
const daysContainer = $(config.selectors.daysContainer);
const days = $(daysContainer[0]).find(config.selectors.days).toArray();

console.log(`[national-day] Found ${days.length} national days.`);

for await (const day of $(days)) {
  let title: string | string[] = $(day)
    .find(config.selectors.title)
    .text()
    .trim();

  const link = $(day).find(config.selectors.link).attr('href')!.trim();

  title = title.split('–')[0].trim();
  title = title.split('|')[0].trim();
  title = title.toLowerCase().split(' ');
  // console.log('title: ', title);
  title = title
    .map((word) => {
      const dontCapitalize = [
        'and',
        'or',
        'the',
        'of',
        'a',
        'an',
        'at',
        'by',
        'to',
        'but',
        'for',
      ];
      if (dontCapitalize.includes(word)) {
        return word;
      }
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(' ');
  const image: string | undefined = $(day)
    .find(config.selectors.image)
    .attr('src');
  if (link && !title?.includes('week') && !title?.includes('month')) {
    if (title && link) {
      if (
        title.toLowerCase().includes('day') &&
        !title.includes('week') &&
        !title.includes('month')
      ) {
        const nationalDay: NationalDay = {
          title,
          link,
          image,
        };
        nationalDaysData.push(nationalDay);
      }
    }
  }
}

const ndData = [] as NationalDay[];

const cheerioCrawler = new CheerioCrawler({
  maxRequestRetries: 3,
  async requestHandler({ request, $ }) {
    console.log(`[national-day] Processing ${request.url}...`);

    const title = $('title').text().split('|')[0].trim();
    const description = $(config.selectors.description.container)
      .find(config.selectors.description.text)
      .first()
      .text()
      .trim();

    ndData.push({
      link: request.url,
      title,
      description,
    });
  },
  failedRequestHandler({ request }) {
    console.log(`[national-day] Request ${request.url} failed.`);
  },
});

await cheerioCrawler.run(nationalDaysData.map((day) => day.link));
// console.log(ndData);

for (const day of ndData) {
  const existingDay = nationalDaysData.find((d) => d.link === day.link);
  if (existingDay && day.description) {
    existingDay.description = day.description;
  }
}

// console.log(nationalDaysData);

// remove entries without description
const filteredNationalDaysData = nationalDaysData.filter(
  (day) => day.description
);

const apiData: APIResults<NationalDay> = {
  lastUpdated: dayjs().tz(config.defaultTimezone).toISOString(),
  data: filteredNationalDaysData,
};

await writeDataAsJsonFile(
  `${config.outputDir}national-day/`,
  config.fileName,
  apiData
);

console.log(apiData);

// output execution time
const debugEnd = hrtime(debugStart);
console.log(`Execution time: ${debugEnd[0] * 1000 + debugEnd[1] / 1000000}ms`);
