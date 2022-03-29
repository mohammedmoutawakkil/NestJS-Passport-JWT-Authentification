import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../../../users/services/users/users.service';
import { authDTO } from './../../dto/auth.dto';
import { Inject, Injectable } from '@nestjs/common';
import { comparePasswords } from 'src/users/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: authDTO) {
    const connection = await this.userService.getUserByUsername(user.username);
    if (connection && comparePasswords(user.password, connection.password)) {
      const payload = { name: connection.username, sub: connection.id };
      const token = {
        access_token: this.jwtService.sign(payload),
      };
      return token;
    }
    return null;
  }
}
