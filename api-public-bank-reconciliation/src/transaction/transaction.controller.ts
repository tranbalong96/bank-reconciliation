import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation } from "@nestjs/swagger";
import { ParseFile } from "../common/parse-file.pipe";
import { TransactionDTO } from "./dto/transaction.dto";
import { TransactionService } from "./transaction.service";

@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
    ) { }

    @ApiOperation({ summary: 'import data with excel or csv file' })
    @Post('/import')
    @UseInterceptors(FileInterceptor('file'))
    import(@UploadedFile(ParseFile) file: Express.Multer.File) {
        return this.transactionService.import(file);
    }

    @ApiOperation({ summary: 'Get all transaction' })
    @Get()
    getAll() {
        return this.transactionService.getAll();
    }

    @ApiOperation({ summary: 'Get transaction by id' })
    @Get(':id')
    getById(@Param('id') id: number) {
        return this.transactionService.getById(id);
    }

    @ApiOperation({ summary: 'create transaction' })
    @Post('')
    @UsePipes(new ValidationPipe())
    create(@Body() dto: TransactionDTO) {
        return this.transactionService.create(dto);
    }

    @ApiOperation({ summary: 'update transaction by id' })
    @Put(':id')
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: number, @Body() dto: TransactionDTO) {
        return this.transactionService.update(id, dto);
    }

    @ApiOperation({ summary: 'delete transaction by id' })
    @Delete(':id')
    @UsePipes(new ValidationPipe())
    delete(@Param('id') id: number) {
        return this.transactionService.delete(id);
    }
}
