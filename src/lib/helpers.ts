import fs from 'node:fs';

export const writeDataAsJsonFile = async (
  path: string,
  fileName: string,
  dataToWrite: object,
) => {
  if (!fs.existsSync(path)) {
    await fs.mkdirSync(path);
  }
  await fs.writeFileSync(
    `${path}${fileName}`,
    JSON.stringify(dataToWrite, null, 2),
  );
};

interface SharedConfig {
  defaultTimezone: string;
  userAgent: string;
  outputDir: string;
}

export const sharedConfig: SharedConfig = {
  defaultTimezone: 'America/New_York',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.8',
  outputDir: 'dist/',
};
