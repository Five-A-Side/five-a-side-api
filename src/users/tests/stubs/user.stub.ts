import { User } from '../../schemas/user.schema';
import { Types } from 'mongoose';

export const userStub = (): User => {
  return {
    _id: new Types.ObjectId("63e4e98efbe00c46646bdb10"),
    entityId: '123',
    name: 'test-name',
    username: 'test-username',
    email: 'test@example.com',
    password: 'test-password'
  }
};
