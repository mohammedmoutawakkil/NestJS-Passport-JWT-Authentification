import { JwtStrategy } from './utils/jwt.strategy';
import { User } from './../typeorm/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './../users/services/users/users.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UsersService,
    },
    JwtStrategy,
  ],
  exports: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
