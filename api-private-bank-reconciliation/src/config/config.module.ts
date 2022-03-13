import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigFactory, ConfigModule as NestConfigModule, ConfigModuleOptions } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { configSchema } from "./config.schema";
import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
    static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
        return {
            module: ConfigModule,
            imports: [
                NestConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: options.envFilePath || '.env.local',
                    validationSchema: Joi.object({ ...configSchema }),
                }),
            ],
            providers: [ConfigService],
            exports: [ConfigService]
        };
    }

    // noinspection JSUnusedGlobalSymbols
    static forFeature(options: ConfigFactory) {
        return NestConfigModule.forFeature(options);
    }
}