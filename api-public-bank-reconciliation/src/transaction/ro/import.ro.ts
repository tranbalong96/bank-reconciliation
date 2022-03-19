import { ApiProperty } from "@nestjs/swagger";
import { TransactionInterface } from "../interfaces/transaction.interface";

export class ImportRO {
    @ApiProperty({
        type: Number,
        example: 1,
    })
    successImport: number;

    @ApiProperty({
        type: Number,
        example: 1,
    })
    errorImport: number;

    @ApiProperty({
        type: Array,
        example: 1,
    })
    errorData: TransactionInterface[];
}