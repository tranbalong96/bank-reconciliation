import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { TransactionInterface } from "./interfaces/transaction.interface";
import * as xlsx from 'xlsx';
import { ClientProxy } from "@nestjs/microservices";
import { ValidateData } from "./interfaces/validate-data.interface";
import { TYPE } from "./constant/type.constant";
import { CommonHelper } from "../common/common.helper";
import { ConfigService } from "../config";
import { TransactionRepository } from "./transaction.repository";
import { TransactionEntity } from "../typeorm";
import { TransactionDTO } from "./dto/transaction.dto";
import { SaveTransactionInterface } from "./interfaces/save-transaction.interface";
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export class TransactionService {
    private readonly logger = new Logger(TransactionService.name);
    constructor(
        @Inject('TRANSACTION_SERVICE') private readonly client: ClientProxy,
        private readonly transactionsRepository: TransactionRepository,
        private readonly configService: ConfigService,
    ) { }

    /**
     * import file csv or excel
     * @param file 
     * @returns 
     */
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

    /**
     * get all transaction
     * @returns TransactionEntity[]
     */
    async getAll(): Promise<TransactionEntity[]> {
        try {
            return await this.transactionsRepository.getAllTransaction();
        } catch (err) {
            this.logger.error('Error -> ', err);
            throw new HttpException(
                {
                    errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
                    errorMessage: 'Cannot get data',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * get transaction by id
     * @param id 
     * @returns TransactionEntity
     */
    async getById(id: number): Promise<TransactionEntity> {
        if (!CommonHelper.isValidNumber(id)) {
            this.logger.error('Error -> id must be number',);
            throw new HttpException(
                {
                    errorCode: 'ERROR.BAD_REQUEST',
                    errorMessage: 'id must be number',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            return await this.transactionsRepository.getById(id);
        } catch (err) {
            this.logger.error('Error -> ', err);
            throw new HttpException(
                {
                    errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
                    errorMessage: 'Cannot get transaction',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * create transaction
     * @param dto 
     * @returns TransactionEntity
     */
    async create(dto: TransactionDTO): Promise<TransactionEntity> {
        const data = this.interfaceMapper(dto);
        try {
            return await this.transactionsRepository.saveTransaction(data);
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
    /**
     * update transaction by id
     * @param id 
     * @param dto 
     * @returns UpdateResult
     */
    async update(id: number, dto: TransactionDTO): Promise<UpdateResult> {
        if (!CommonHelper.isValidNumber(id)) {
            this.logger.error('Error -> id must be number',);
            throw new HttpException(
                {
                    errorCode: 'ERROR.BAD_REQUEST',
                    errorMessage: 'id must be number',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            const isIdExisted = this.transactionsRepository.isIdExisted(id);
            if (!isIdExisted) {
                this.logger.error('Error -> id not existed',);
                throw new HttpException(
                    {
                        errorCode: 'ERROR.BAD_REQUEST',
                        errorMessage: 'id not existed',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }
            const data = this.interfaceMapper(dto);
            return await this.transactionsRepository.updateTransaction(id, data);
        } catch (err) {
            this.logger.error('Error -> ', err);
            throw new HttpException(
                {
                    errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
                    errorMessage: 'Cannot update data',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * delete transaction by id
     * @param id 
     * @returns DeleteResult
     */
    async delete(id: number): Promise<DeleteResult> {
        if (!CommonHelper.isValidNumber(id)) {
            this.logger.error('Error -> id must be number',);
            throw new HttpException(
                {
                    errorCode: 'ERROR.BAD_REQUEST',
                    errorMessage: 'id must be number',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            const isIdExisted = this.transactionsRepository.isIdExisted(id);
            if (!isIdExisted) {
                this.logger.error('Error -> id not existed',);
                throw new HttpException(
                    {
                        errorCode: 'ERROR.BAD_REQUEST',
                        errorMessage: 'id not existed',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }
            return await this.transactionsRepository.deleteTransaction(id);
        } catch (err) {
            this.logger.error('Error -> ', err);
            throw new HttpException(
                {
                    errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
                    errorMessage: 'Cannot delete data',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * convert dto to interface
     * @param dto 
     * @returns SaveTransactionInterface
     */
    private interfaceMapper(dto: TransactionDTO): SaveTransactionInterface {
        const result: SaveTransactionInterface = {
            ...dto,
        };
        return result;
    }

    /**
     * convert data to json with csv data
     * @param data 
     * @returns ValidateData
     */
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

    /**
     * convert data to json with excel data
     * @param buffer 
     * @param sheetPosition 
     * @returns 
     */
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

    /**
     * convert date to date valid
     * @param data 
     * @returns ValidateData
     */
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

    /**
     * check data valid
     * @param transaction 
     * @returns 
     */
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
