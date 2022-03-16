import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../config';
import entities from '../typeorm';

@Module({})
export class MysqlDatabaseModule {
    static forRoot(): DynamicModule {
        return {
            module: MysqlDatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (
                        configService: ConfigService
                    ): Promise<TypeOrmModuleOptions> => {
                        return {
                            type: 'mysql',
                            host: configService.get('DB_HOST') || '',
                            port: configService.get('DB_PORT') || 3306,
                            username: configService.get('DB_USER') || '',
                            password: configService.get('DB_PASSWORD') || '',
                            database: configService.get('DB_NAME') || '',
                            entities,
                            autoLoadEntities: true,
                            synchronize: true,
                        };
                    }
                })
            ],
            exports: [TypeOrmModule]
        };
    }
}
