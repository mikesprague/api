import { CheerioCrawler, createCheerioRouter } from 'crawlee';
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
// log.setLevel(LogLevel.DEBUG);

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
const nationalDaysDescriptions: NationalDay[] = [];

// instantiate Crawlee CheerioRouter
const router = createCheerioRouter();

// handler for the main page that lists the national days
router.addHandler('LIST', async ({ $, request, enqueueLinks, log }) => {
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
          // console.log(nationalDay);
          nationalDaysData.push(nationalDay);
          enqueueLinks({
            selector: config.selectors.link,
            label: 'DETAIL',
          });
        }
      }
    }
  }
});

router.addHandler('DETAIL', async ({ request, $ }) => {
  console.log(`[national-day] Processing ${request.url}...`);

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

const cheerioCrawler = new CheerioCrawler({
  maxRequestRetries: 3,
  requestHandler: router,
  failedRequestHandler({ request }) {
    console.log(`[national-day] Request ${request.url} failed.`);
  },
});

await cheerioCrawler.run([
  {
    url: config.urlToScrape,
    label: 'LIST',
  },
]);
// console.log(nationalDaysDescriptions);

for (const day of nationalDaysDescriptions) {
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
