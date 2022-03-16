import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation } from "@nestjs/swagger";
import { Roles } from "../common/decorators/roles.decorator";
import { ParseFile } from "../common/parse-file.pipe";
import { TransactionDTO } from "./dto/transaction.dto";
import { TransactionService } from "./transaction.service";

@Controller('transaction')
@Roles()
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
    ) { }

    /**
     * POST /api/transaction/import
     */
    @ApiOperation({ summary: 'import data with excel or csv file' })
    @Post('/import')
    @UseInterceptors(FileInterceptor('file'))
    import(@UploadedFile(ParseFile) file: Express.Multer.File) {
        return this.transactionService.import(file);
    }

    /**
     * GET /api/transaction
     */
    @ApiOperation({ summary: 'Get all transaction' })
    @Get()
    getAll() {
        return this.transactionService.getAll();
    }

    /**
     * GET /api/transaction/:id
     */
    @ApiOperation({ summary: 'Get transaction by id' })
    @Get(':id')
    getById(@Param('id') id: number) {
        return this.transactionService.getById(id);
    }

    /**
     * POST /api/transaction
     */
    @ApiOperation({ summary: 'create transaction' })
    @Post()
    @UsePipes(new ValidationPipe())
    create(@Body() dto: TransactionDTO) {
        return this.transactionService.create(dto);
    }

    /**
     * PUT /api/transaction/:id
     */
    @ApiOperation({ summary: 'update transaction by id' })
    @Put(':id')
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: number, @Body() dto: TransactionDTO) {
        return this.transactionService.update(id, dto);
    }

    /**
     * DELETE /api/transaction/:id
     */
    @ApiOperation({ summary: 'delete transaction by id' })
    @Delete(':id')
    @UsePipes(new ValidationPipe())
    delete(@Param('id') id: number) {
        return this.transactionService.delete(id);
    }
}
