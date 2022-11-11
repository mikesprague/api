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
    urlToScrape: 'https://nationaldaycalendar.com/',
    selectors: {
      group: 'div.sep_month_events',
      days: '.eventon_list_event.evo_eventtop.scheduled.event',
      title: 'span.evcal_event_title',
      link: 'a',
      description: {
        container: '#ff-main-container > main > article > section',
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
    .catch((error) => console.error(`[national-day] Error: \n`, error));
  const $ = cheerio.load(pageData);
  const groupData = $(config.selectors.group);
  const days = $(groupData).find(config.selectors.days);
  for await (const day of $(days)) {
    const title = $(day).find(config.selectors.title).text().trim();
    const link = $(day).find(config.selectors.link).first().attr('href').trim();
    // console.log(title, link);
    // nationalDaysData.push({
    //   name: title,
    //   url: link,
    // });
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
      });
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
