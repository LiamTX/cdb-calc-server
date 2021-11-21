import { createReadStream } from "fs";
import * as csv from 'csv-parser';

export default async (filePath: string): Promise<any[]> => {
    return await new Promise((resolve, reject) => {
        const results = [];
        createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                console.log('line csv ----> ', data);
                results.push(data);
            })
            .on('end', () => {
                return resolve(results);
            }).on('error', (error) => {
                return reject(error);
            });
    })
}