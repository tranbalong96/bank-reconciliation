import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { TYPE } from "../constant/type.constant";

export class TransactionRO {
    @ApiProperty({
        type: Number,
        example: 1,
    })
    id: number;

    @ApiProperty({
        type: String,
        example: 'ABC',
    })
    @Expose()
    content: string;

    @ApiProperty({
        type: Number,
        example: 100000,
    })
    @Expose()
    amount: number;

    @ApiProperty({
        type: TYPE,
        example: TYPE.DEPOSIT,
    })
    @Expose()
    type: TYPE;

    @ApiProperty({
        type: Date,
        example: '2010-10-10T03:10:10.000Z',
    })
    @Expose()
    date: Date;
}