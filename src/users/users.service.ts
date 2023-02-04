import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository
  ) { }


  async createUser(request: CreateUserRequest) {
    //const session = await this.usersRepository.startTransaction();
    try {
      const user = await this.usersRepository.create(request);
      //await session.commitTransaction();
      return user;
    } catch (error) {
      //await session.abortTransaction();
      throw error;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  //update(id: number, updateUserDto: UpdateUserDto) {
  //return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
