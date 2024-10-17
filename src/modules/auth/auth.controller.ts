import {Controller, Post, Body, Request, UseGuards, UseInterceptors, UseFilters} from '@nestjs/common';
import { AuthService } from './auth.service';
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {TransformResponseInterceptor} from "../../interceptors/transform-response.interceptor";
import {InternalServerErrorExceptionFilter} from "../../filters/internal-server-error-exception";
import {BadRequestExceptionFilter} from "../../filters/bad-request-exception";

@Controller('auth')
@UseFilters(BadRequestExceptionFilter)
@UseFilters(InternalServerErrorExceptionFilter)
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto.username, registerDto.password);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            return { message: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }
}
