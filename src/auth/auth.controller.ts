import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body()
    SignUpDto: SignUpDto,
  ): Promise<{ message: string; token: string } | Error> {
    try {
      const result = await this.authService.signUp(SignUpDto);

      return { message: 'signup done', token: result };
    } catch (e) {
      throw new Error(`something went wrong ${e?.message}`);
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string; token: string } | Error> {
    try {
      const result = await this.authService.login(loginDto);
      return { message: 'login done', token: result };
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new InternalServerErrorException(`Failed to login: ${e?.message}`);
    }
  }
}
