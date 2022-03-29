import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './../../dto/UpdateUser.dto';
import { Response } from 'express';
import { CreateUserDto } from './../../dto/CreateUser.dto';
import { SerializedUser } from './../../types/';
import {
  Controller,
  Get,
  Inject,
  Param,
  HttpException,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Delete,
  Res,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserById(id);
    if (user) return new SerializedUser(user);
    else throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    if (this.userService.createUser(createUserDto))
      return res.status(202).send('User Created Successfully');
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const status = await this.userService.deleteUser(id);
    if (status != 0) return res.status(202).send('User Deleted Successfully');
    else throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    if (await this.userService.updateUser(id, updateUserDto))
      return res.status(202).send('User Updated Successfully');
  }
}
