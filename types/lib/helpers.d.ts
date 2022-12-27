export type StringOrUndefined = string | undefined;
export interface SharedConfig {
    defaultTimezone: string;
    userAgent: string;
    outputDir: string;
}
/**
 * @function writeDataAsJsonFile
 * @summary  writes an object to a file as a string in JSON format
 * @example  await writeDataAsJsonFile(
 *   'outputDirectory/',
 *   'my-data.json',
 *   referenceToDataObject
 * );
 * @param    {string} path
 * @param    {string} fileName
 * @param    {Object} dataToWrite
 * @returns  {Promise<void>}
 */
export declare const writeDataAsJsonFile: <T extends object>(path: string, fileName: string, dataToWrite: T) => Promise<void>;
export declare const sharedConfig: SharedConfig;
