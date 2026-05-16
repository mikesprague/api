import { CheerioCrawler, createCheerioRouter, log, LogLevel } from 'crawlee';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

import { sharedConfig, writeDataAsJsonFile } from './lib/helpers';
import type {
  APIResults,
  NationalDay,
  NationalDayConfig,
} from './lib/types.js';

import 'varlock/auto-load';

const { hrtime } = process;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(sharedConfig.defaultTimezone);

// set crawlee log level
log.setLevel(LogLevel.INFO);

const debugStart = hrtime();

log.info('[national-day] Starting workflow run');

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
const nationalDaysDescriptions: NationalDay[] = [];

// instantiate Crawlee CheerioRouter
const router = createCheerioRouter();

// handler for the main page that lists the national days
log.info('[national-day] Instantiate router for main page');
router.addHandler('LIST', async ({ $, request, enqueueLinks }) => {
  log.info(`[national-day] Processing ${request.url}...`);

  const daysContainer = $(config.selectors.daysContainer);
  const days = $(daysContainer[0]).find(config.selectors.days).toArray();
  log.info(`[national-day] Found ${days.length} national days.`);

  for (const day of days) {
    const link = $(day).find(config.selectors.link).attr('href')!.trim();
    let title: string | string[] = $(day)
      .find(config.selectors.title)
      .text()
      .trim();

    title = title.split('–')[0].trim();
    title = title.split('|')[0].trim();
    title = title.toLowerCase().split(' ');

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
          // log.info(nationalDay);
          nationalDaysData.push(nationalDay);
        }
      }
    }
  }
  const urls = nationalDaysData.map((d) => d.link);
  await enqueueLinks({
    urls,
    label: 'DETAIL',
  });
});

log.info('[national-day] Instantiate router for individual day pages');
router.addHandler('DETAIL', async ({ request, $ }) => {
  log.info(`[national-day] Processing ${request.url}...`);

  const title = $('title').text().split('|')[0].trim();
  const description = $(config.selectors.description.container)
    .find(config.selectors.description.text)
    .first()
    .text()
    .trim();

  nationalDaysDescriptions.push({
    link: request.url,
    title,
    description,
  });
});

log.info('[national-day] Initialize crawler');
const cheerioCrawler = new CheerioCrawler({
  maxRequestRetries: 3,
  requestHandler: router,
  failedRequestHandler({ request }) {
    log.info(`[national-day] Request ${request.url} failed.`);
  },
});

log.info('[national-day] Run crawler');
await cheerioCrawler.run([
  {
    url: config.urlToScrape,
    label: 'LIST',
  },
]);
// log.info(nationalDaysDescriptions);

log.info('[national-day] Validate data');
for (const day of nationalDaysDescriptions) {
  const existingDay = nationalDaysData.find((d) => d.link === day.link);
  if (existingDay && day.description) {
    existingDay.description = day.description;
  }
}
// log.info(nationalDaysData);

// remove entries without description
log.info('[national-day] Clean data');
const filteredNationalDaysData = nationalDaysData.filter(
  (day) => day.description
);

const apiData: APIResults<NationalDay> = {
  lastUpdated: dayjs().tz(config.defaultTimezone).toISOString(),
  data: filteredNationalDaysData,
};

log.info('[national-day] Write data to JSON file');
await writeDataAsJsonFile(
  `${config.outputDir}national-day/`,
  config.fileName,
  apiData
);

console.log(apiData);

// output execution time
const debugEnd = hrtime(debugStart);
log.info('[national-day] Workflow run complete');
log.info(`Execution time: ${debugEnd[0] * 1000 + debugEnd[1] / 1000000}ms`);
