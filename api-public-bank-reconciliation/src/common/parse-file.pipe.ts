import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException,
} from '@nestjs/common';
import { FILE_WHILE_LIST } from './constant';

@Injectable()
export class ParseFile implements PipeTransform {
    transform(
        files: Express.Multer.File,
        metadata: ArgumentMetadata,
    ): Express.Multer.File {
        if (files === undefined || files === null) {
            throw new BadRequestException('Validation failed (file expected)');
        }

        if (Array.isArray(files) && files.length === 0) {
            throw new BadRequestException('Validation failed (files expected)');
        }
        if (!FILE_WHILE_LIST.some(whileList => files.originalname.includes(whileList))) {
            throw new BadRequestException('Validation failed (files expected)');
        }

        return files;
    }
}
