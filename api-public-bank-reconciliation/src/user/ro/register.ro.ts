import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class RegisterRO {
    @ApiProperty({
        type: Number,
        example: 1,
    })
    @Expose()
    id: number;

    @ApiProperty({
        type: String,
        example: 'ABC',
    })
    @Expose()
    name: string;

    @ApiProperty({
        type: String,
        example: 'ABC',
    })
    @Expose()
    username: string;
}