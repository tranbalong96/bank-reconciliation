import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { TransactionInterface } from "./interfaces/transaction.interface";
import * as xlsx from 'xlsx';
import { ClientProxy } from "@nestjs/microservices";
import { ValidateData } from "./interfaces/validate-data.interface";
import { TYPE } from "./constant/type.constant";
import { CommonHelper } from "../common/common.helper";
import { ConfigService } from "../config";

@Injectable()
export class TransactionService {
    private readonly logger = new Logger(TransactionService.name);
    constructor(
        @Inject('TRANSACTION_SERVICE') private readonly client: ClientProxy,
        private readonly configService: ConfigService,
    ) { }

    async import(file: Express.Multer.File) {
        const dataString = file.buffer.toString('utf-8');
        const isCSV = file.originalname.includes('.csv');
        const dataJson = isCSV ? this.convertDataCSVToJson(dataString) : this.convertDataExcelToJson(file.buffer, 0);
        this.logger.log(`${dataJson.invalidArr.length} data invalid: ${JSON.stringify(dataJson.invalidArr)}`);
        if (dataJson.validArr.length === 0) {
            return dataJson;
        }
        try {
            const LIMIT_NUMBER = this.configService.get('LIMIT_NUMBER');
            const dataSplitUp = this.splitUpData(dataJson.validArr, LIMIT_NUMBER);
            dataSplitUp.forEach(data => {
                this.client.emit('create', data);
            });
            return dataJson;
        } catch (err) {
            this.logger.error('Error -> ', err);
            throw new HttpException(
                {
                    errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
                    errorMessage: 'Cannot save data',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private convertDataCSVToJson(data: string): ValidateData {
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const result: ValidateData = {
            validArr: [],
            invalidArr: [],
        };
        const headers = lines[0].replace(/\r/g, '').split(',');
        lines.forEach((line, indexLine) => {
            if (!indexLine) {
                return;
            }
            const object = {};
            const currentLine = line.replace(/\r/g, '').split(',');
            headers.forEach((header, indexHeader) => {
                let value: any = currentLine[indexHeader]
                if (header === 'date') {
                    // Converted because the date is not in the correct format to save to database dd/MM/yyy hh:MM:ss => MM/dd/yyy hh:MM:ss

                    //check validate
                    const dateArr = currentLine[indexHeader].split('/');
                    value = `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`;
                } else if (header === 'amount') {
                    const amount = Number(currentLine[indexHeader]);
                    value = CommonHelper.isValidNumber(amount) ? amount : currentLine[indexHeader];
                }
                object[header] = value;
            });
            const data = object as TransactionInterface;
            const keyValid = this.isValidData(data) ? 'validArr' : 'invalidArr';
            result[keyValid].push(data);
        });
        return result;
    }

    private convertDataExcelToJson(buffer: Buffer, sheetPosition?: number): ValidateData {
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

    private convertValidDate(data: TransactionInterface[]): ValidateData {
        const result: ValidateData = {
            validArr: [],
            invalidArr: [],
        };
        // Converted because the date is not in the correct format to save to database dd/MM/yyy hh:MM:ss => MM/dd/yyy hh:MM:ss
        data.map(dt => {
            const dateArr = dt.date.split('/');
            //check validate
            dt.date = `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`;
            const keyValid = this.isValidData(dt) ? 'validArr' : 'invalidArr';
            result[keyValid].push(dt);
            return dt;
        });
        return result;
    }

    private isValidData(transaction: TransactionInterface): boolean {
        return CommonHelper.isValidDate(new Date(transaction.date)) && this.isValidAmountAndType(transaction.amount, transaction.type);
    }


    

    private isValidAmountAndType(amount: number, type: TYPE): boolean {
        return typeof Number(amount) === 'number' &&
        (amount > 0 && type === TYPE.DEPOSIT || (amount < 0 || amount == 0) && type === TYPE.WITHDRAW)
    }


    private splitUpData(data: object[], numSplit: number = 500) {
        const caseNumber = Math.floor(data.length / numSplit);
        if (data.length < numSplit) {
            return data;
        }
        const splitArr = [];
        for (let i = 0; i < caseNumber; i++) {
            const from = i * numSplit;
            const to = i + numSplit;
            splitArr[i] = data.slice(from, to);
        }
        return splitArr;
    }
}
