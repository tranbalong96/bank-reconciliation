import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TransactionInterface } from "./interfaces/transaction.interface";
import * as xlsx from 'xlsx';
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class TransactionService {
    constructor(
        @Inject('TRANSACTION_SERVICE') private readonly client: ClientProxy,
    ) {}

    async import(file: Express.Multer.File) {
        const dataString = file.buffer.toString('utf-8');
        const isCSV = file.originalname.includes('.csv');
        const dataJson = isCSV ? this.convertDataCSVToJson(dataString) : this.convertDataExcelToJson(file.buffer, 0);
        try {
            // send data to rabbitmq
            // this.client.emit('data', dataJson);
        } catch (err) {
            throw new HttpException(
                {
                    errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
                    errorMessage: 'Cannot save data',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private convertDataCSVToJson(data: string): object[] {
        const lines = data.split('\n').filter(line => line.trim() !== '')
        const result = []
        const headers = lines[0].replace(/\r/g, '').split(',')
        lines.forEach((line, indexLine) => {
            if (!indexLine) {
                return;
            }
            const object = {};
            const currentLine = line.replace(/\r/g, '').split(',');
            headers.forEach((header, indexHeader) => {
                let value = currentLine[indexHeader]
                if (header === 'date') {
                    // Converted because the date is not in the correct format to save to database dd/MM/yyy hh:MM:ss => MM/dd/yyy hh:MM:ss

                    //check validate
                    const dateArr = currentLine[indexHeader].split('/');
                    value = `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`;
                }
                object[header] = value;
            });
            result.push(object)
        });
        return result;
    }

    private convertDataExcelToJson(buffer: Buffer, sheetPosition?: number): object[] {
        const workbook = xlsx.read(buffer, { type: "buffer" });
        const result: TransactionInterface[] = [];

        if (typeof sheetPosition === 'number') {
            const sheetName = workbook.SheetNames[sheetPosition];
            const worksheet = workbook.Sheets[sheetName]
            result.push(...xlsx.utils.sheet_to_json(worksheet) as TransactionInterface[]);
        } else {
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                result.push(...xlsx.utils.sheet_to_json(worksheet) as TransactionInterface[]);
            })
        }
        return this.convertValidDate(result);
    }

    private convertValidDate(data: TransactionInterface[]): TransactionInterface[] {
        // Converted because the date is not in the correct format to save to database dd/MM/yyy hh:MM:ss => MM/dd/yyy hh:MM:ss
        return data.map(dt => {
            const dateArr = dt.date.split('/');
            //check validate
            dt.date = `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`;
            return dt;
        });
    }
}
