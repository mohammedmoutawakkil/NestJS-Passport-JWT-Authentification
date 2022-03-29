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
  }
  getUserByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }
  async getUserById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
}
