import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "../config";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync(
            {
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => {
                    return {
                        secret: configService.getSecret(),
                        signOptions: {
                            expiresIn: `${Number(configService.getExpiresIn()) * 60}s`,
                        },
                        
                    }
                }
            })
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { }
