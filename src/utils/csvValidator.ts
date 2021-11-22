import { createReadStream } from "fs";
import * as csv from 'csv-parser';

// Csv validator function
export default async (filePath: string) => {
    // Headers that are required
    const allowedHeaders = ['sSecurityName', 'dtDate', 'dLastTradePrice'];

    return await new Promise((resolve) => {
        // Create a read stream from the file
        createReadStream(filePath)
            // Use the csv parser funcion like a pipe
            .pipe(csv())
            // On 'headers' get the csv headers and verify
            .on('headers', headers => {
                headers.map(header => {
                    if (!allowedHeaders.includes(header)) {
                        return resolve(`Header ${header} invalid`)
                    }
                    if (headers.length !== allowedHeaders.length) {
                        return resolve("Invalid headers");
                    }
                });

                return resolve(null);
            })
            .on('error', error => {
                return resolve('Invalid file!');
            })
    })
}