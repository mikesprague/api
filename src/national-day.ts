import cheerio from 'cheerio';
import dayjs from 'dayjs';
import got from 'got';

import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import {
  APIResults,
  SharedConfig,
  StringOrNull,
  sharedConfig,
  writeDataAsJsonFile,
} from './lib/helpers.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(sharedConfig.defaultTimezone);

const { hrtime } = process;

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

(async () => {
  const debugStart = hrtime();

  const config: NationalDayConfig = {
    urlToScrape: 'https://nationaldaycalendar.com/what-day-is-it/',
    selectors: {
      days: `.ultp-block-items-wrap.ultp-block-row .ultp-block-item .ultp-block-entry-content`,
      title: '.ultp-block-title',
      link: '.ultp-block-title a',
      image: '.ultp-block-image img',
      description: {
        container: '.entry-content.wp-block-post-content',
        text: 'h2 ~ p',
      },
    },
    fileName: 'index.json',
    ...sharedConfig,
  };

  const nationalDaysData: NationalDay[] = [];
  const pageData: string = await got
    .get(config.urlToScrape, {
      headers: {
        'User-Agent': config.userAgent,
      },
    })
    .then(async (response) => response.body)
    // .then(async (response) => {
    //   console.log(response.body);
    //   return response.body;
    // })
    .catch((error) => {
      console.error(`[national-day] Error: \n`, error);
      return error;
    });

  const $ = cheerio.load(pageData);
  const days = $(config.selectors.days);
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
    if (link) {
      const descriptionData: string = await got(link)
        .then(async (response) => response.body)
        .catch((error) => {
          console.error(`[national-day] Error: \n`, error);
          return error;
        });
      const $desc = cheerio.load(descriptionData);
      const description = $desc(config.selectors.description.container)
        .find(config.selectors.description.text)
        .first()
        .text()
        .trim();
      // console.log(description);
      if (title && link && description) {
        const nationalDay: NationalDay = {
          title,
          link,
          description,
          image,
        };
        nationalDaysData.push(nationalDay);
      }
    }
  }

  const apiData: APIResults<NationalDay> = {
    lastUpdated: dayjs().tz(config.defaultTimezone).toISOString(),
    data: nationalDaysData,
  };

  await writeDataAsJsonFile(`${config.outputDir}national-day/`, config.fileName, apiData);

  console.log(apiData);

  // output execution time
  const debugEnd = hrtime(debugStart);
  console.log(
    `Execution time: ${debugEnd[0] * 1000 + debugEnd[1] / 1000000}ms`,
  );
})();
