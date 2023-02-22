import { User } from '../../schemas/user.schema';
import { CreateUserRequest } from 'src/users/dto/create-user.request';
import { UpdateUserRequest } from 'src/users/dto/update-user.request';
import { Types } from 'mongoose';

export const userStub = (): User => {
  return {
    _id: new Types.ObjectId('63e4e98efbe00c46646bdb10'),
    entityId: '123',
    name: 'test-name',
    username: 'test-username',
    email: 'test@example.com',
    password: 'test-password',
  };
};

export const userStub2 = (): User => {
  return {
    _id: new Types.ObjectId('63e4e98efbe00c46646bdb10'),
    entityId: '123',
    name: 'test-name',
    username: 'test-username',
    email: 'test2@example.com',
    password: 'test-password',
  };
};

export const createUserDto = (): CreateUserRequest => {
  return {
    name: 'test-name',
    username: 'test-username',
    email: 'test@example.com',
    password: 'test-password',
  };
};

export const invalidCreateUserDto = (): CreateUserRequest => {
  return {
    name: '',
    username: 'test-username',
    email: 'test@example.com',
    password: 'test-password',
  };
};

export const updateUserDto = (): UpdateUserRequest => {
  return {
    name: 'test-name',
    username: 'test-username',
    email: 'test2@example.com',
  };
};

export const invalidUpdateUserDto = (): UpdateUserRequest => {
  return {
    name: '',
    username: 'test-username',
    email: 'test2@example.com',
  };
};
