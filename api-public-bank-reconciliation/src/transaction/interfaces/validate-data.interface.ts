import { TransactionInterface } from "./transaction.interface";

export interface ValidateData {
    validArr: TransactionInterface[];
    invalidArr: TransactionInterface[];
}