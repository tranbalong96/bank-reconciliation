import { TYPE } from "../constant/type.constant";

export interface TransactionInterface {
    content: string;
    amount: number;
    type: TYPE;
    date: string;
}