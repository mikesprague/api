import cheerio from 'cheerio';
import dayjs from 'dayjs';
import got from 'got';

import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import { writeDataAsJsonFile, sharedConfig } from './lib/helpers.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(sharedConfig.defaultTimezone);

const { hrtime } = process;

(async () => {
  const debugStart = hrtime();

  const config = {
    urlToScrape: `https://nationaldaycalendar.com/${dayjs()
      .format('MMMM')
      .toLowerCase()}/#tab-${dayjs().format('D')}`,
    selectors: {
      days: `.kt-inner-tab-${dayjs().format('D')} .ultp-block-item`,
      title: 'h2.ultp-block-title',
      link: 'h2.ultp-block-title a',
      image: '.ultp-block-image img',
      description: {
        container: '.entry-content.wp-block-post-content',
        text: 'h2 ~ p',
      },
    },
    fileName: 'national-day.json',
  };

  let nationalDaysData = [];
  const pageData = await got
    .get(config.urlToScrape, {
      headers: {
        'User-Agent': sharedConfig.userAgent,
      },
    })
    .then(async (response) => response.body)
    // .then(async (response) => {
    //   console.log(response.body);
    //   return response.body;
    // })
    .catch((error) => console.error(`[national-day] Error: \n`, error));

  const $ = cheerio.load(pageData);
  const days = $(config.selectors.days);
  for await (const day of $(days)) {
    let title = $(day).find(config.selectors.title).text().trim();
    title = title.split('-')[0].trim();
    title = title.split('–')[0].trim();
    title = title.toLowerCase().split(' ');
    // console.log(title);
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
    const link = $(day).find(config.selectors.link).attr('href').trim();
    let image = null;
    image = $(day).find(config.selectors.image).attr('src');
    // nationalDaysData.push({
    //   name: title,
    //   url: link,
    // });
    if (link) {
      const descriptionData = await got(link)
        .then(async (response) => response.body)
        .catch((error) => console.error(`[national-day] Error: \n`, error));
      const $desc = cheerio.load(descriptionData);
      const description = $desc(config.selectors.description.container)
        .find(config.selectors.description.text)
        .first()
        .text()
        .trim();
      // console.log(description);
      if (title && link && description) {
        nationalDaysData.push({
          title,
          link,
          description,
          image,
        });
      }
    }
  }

  const apiData = {
    lastUpdated: dayjs().tz(sharedConfig.defaultTimezone).toISOString(),
    data: nationalDaysData,
  };

  writeDataAsJsonFile(sharedConfig.outputDir, config.fileName, apiData);

  console.log(apiData);

  // output execution time
  const debugEnd = hrtime(debugStart);
  console.log(
    `Execution time: ${debugEnd[0] * 1000 + debugEnd[1] / 1000000}ms`,
  );
})();
