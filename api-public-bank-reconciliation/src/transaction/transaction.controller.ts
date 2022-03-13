import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation } from "@nestjs/swagger";
import { TransactionService } from "./transaction.service";

@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
    ) { }

    @ApiOperation({ summary: 'import data with excel or csv file' })
    @Post('/import')
    @UseInterceptors(FileInterceptor('file'))
    async import(@UploadedFile() file: Express.Multer.File) {
        return await this.transactionService.import(file);
    }

}
