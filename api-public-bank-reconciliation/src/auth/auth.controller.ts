import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    /**
     * POST /api/auth/login
     */
    @ApiOperation({ summary: 'login to system' })
    @Post('/login')
    @UsePipes(new ValidationPipe())
    login(@Body() dto: LoginDTO) {
        return this.authService.login(dto)
    }
}
