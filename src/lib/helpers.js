import fs from 'node:fs';

export const writeDataAsJsonFile = async (path, fileName, dataToWrite) => {
  if (!fs.existsSync(path)) {
    await fs.mkdirSync(path);
  }
  await fs.writeFileSync(
    `${path}${fileName}`,
    JSON.stringify(dataToWrite, null, 2),
  );
};

export const sharedConfig = {
  defaultTimezone: 'America/New_York',
  outputDir: 'dist/',
};
