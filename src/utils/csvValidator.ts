import { createReadStream } from "fs";
import * as csv from 'csv-parser';

export default async (filePath: string) => {
    const allowedHeaders = ['sSecurityName', 'dtDate', 'dLastTradePrice'];

    return await new Promise((resolve) => {
        createReadStream(filePath)
            .pipe(csv())
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