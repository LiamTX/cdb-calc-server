import { createReadStream } from "fs";
import * as csv from 'csv-parser';

// Csv reader function
export default async (filePath: string): Promise<any[]> => {
    return await new Promise((resolve, reject) => {
        const results = [];
        // Create a read stream from the file
        createReadStream(filePath)
            // Use the csv parser funcion like a pipe
            .pipe(csv())
            // On 'data' add to return array the csv data parsed to json
            .on('data', (data) => {
                console.log('line csv ----> ', data);
                results.push(data);
            })
            // On 'end' return the result array
            .on('end', () => {
                return resolve(results);
            }).on('error', (error) => {
                return reject(error);
            });
    })
}