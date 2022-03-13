import { Controller, Post, UploadedFile } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { TransactionService } from "./transaction.service";

@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
    ) { }

    @ApiOperation({ summary: 'import data with excel or csv file' })
    @Post('/import')
    async import(@UploadedFile() file: Express.Multer.File) {
        return await this.transactionService.import(file);
    }

}
