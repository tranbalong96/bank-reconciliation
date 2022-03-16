import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { RegisterDTO } from "./dto/register.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    /**
     * POST /api/user/register
     */
    @ApiOperation({ summary: 'register user account' })
    @Post('/register')
    @UsePipes(new ValidationPipe())
    register(@Body() dto: RegisterDTO) {
        return this.userService.register(dto);
    }
}
