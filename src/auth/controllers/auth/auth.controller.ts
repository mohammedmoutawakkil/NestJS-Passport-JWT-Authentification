import { Response } from 'express';
import { authDTO } from './../../dto/auth.dto';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}
  @Post()
  @UsePipes(ValidationPipe)
  async login(@Body() authdto: authDTO, @Res() res: Response) {
    const token = await this.authService.login(authdto);
    if (token) {
      res
        .cookie('access_token', token.access_token, {
          httpOnly: true,
          domain: process.env.DB_HOST, // your domain here!
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        })
        .send({
          statusCode: 201,
          message: 'Authorized',
        });
      return token;
    } else throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
  }
}
