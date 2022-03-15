import { TYPE } from "../constant/type.constant";

export interface SaveTransactionInterface {
    content: string;
    amount: number;
    type: TYPE;
    date: Date;
}