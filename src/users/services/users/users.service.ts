import { encodePassword } from 'src/users/utils/bcrypt';
import { UpdateUserDto } from './../../dto/UpdateUser.dto';
import { CreateUserDto } from './../../dto/CreateUser.dto';
import { User, SerializedUser } from '../../types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private users: User[];

  async getUsers() {
    const users = await this.userRepository.find();
    return users.map((user) => new SerializedUser(user));
    //return this.users.map(user=>new SerializedUser(user));
  }
  getUserByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }
  async getUserById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
  createUser(createUserDto: CreateUserDto) {
    const password = encodePassword(createUserDto.password);
    const newUser = this.userRepository.create({ ...createUserDto, password });
    this.userRepository.save(newUser);
    return true;
  }
  async deleteUser(id: number) {
    const user = await this.userRepository.delete(id);
    return user.affected;
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.getUserById(id);
    user.username = updateUserDto.username;
    user.email = updateUserDto.email;
    user.password = encodePassword(updateUserDto.password);
    this.userRepository.save(user);
    return true;
  }
}
