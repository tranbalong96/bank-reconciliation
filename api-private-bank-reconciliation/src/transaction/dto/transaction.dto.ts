import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CheckTypeAmount } from "../../common/decorators/check-type-amount.decorator";
import { TYPE } from "../constant/type.constant";

export class TransactionDTO {
    @ApiProperty(
        {
            type: String,
            example: 'Any text content',
        }
    )
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty(
        {
            type: Number,
            example: -500,
        }
    )
    @IsNumber()
    @IsNotEmpty()
    @CheckTypeAmount('type')
    amount: number

    @ApiProperty(
        {
            type: String,
            example: TYPE.DEPOSIT,
        }
    )
    @IsEnum(TYPE)
    @IsNotEmpty()
    type: TYPE;

    @ApiProperty(
        {
            type: Date,
            example: new Date(),
        }
    )
    @IsNotEmpty()
    @IsDateString()
    date: Date;
}
