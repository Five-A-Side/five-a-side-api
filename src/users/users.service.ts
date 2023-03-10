import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UpdateUserRequest } from './dto/update-user.request';
import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { Bcrypt } from '../common/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcrypt: Bcrypt,
  ) {}

  /**
   * Creates a new user based on the provided request information
   *
   * @param {CreateUserRequest} request - The request containing the information to create a new user
   * @returns {Promise<User>} A Promise that resolves to the newly created user
   */
  createUser = async (request: CreateUserRequest): Promise<User> => {
    const encodedPassword = await this.bcrypt.encodePassword(request.password);
    const user: User = await this.usersRepository.create({
      ...request,
      password: encodedPassword,
    });
    return user;
  };

  /**
   * Retrieves the list of all users
   *
   * @returns {Promise<User[]>} A promise that resolves to an array of users
   */
  list = async (): Promise<User[]> => {
    const users: User[] = await this.usersRepository.find({});
    return users;
  };

  /**
   * Retrieve a user by entityId
   *
   * @param {string} entityId - entityId of the user to retrieve
   * @returns {Promise<User>} - Promise resolving to the retrieved user
   * @throws {UserNotFoundException} - Thrown if no user is found with the given ID
   */
  findByEntityId = async (entityId: string): Promise<User> => {
    const user: User = await this.usersRepository.findOne({ entityId });

    if (!user) {
      throw new UserNotFoundException(entityId);
    }

    return user;
  };

  /**
   * Updates a user by entityId
   *
   * @param {string} entityId - The entityId of the user to be updated
   * @param {UpdateUserRequest} request - The request containing the information to update a user
   * @returns {Promise<User>} - Promise resolving to the updated user
   */
  updateUser = async (
    entityId: string,
    request: UpdateUserRequest,
  ): Promise<User> => {
    const newUser: User = await this.usersRepository.findOneAndUpdate(
      { entityId },
      request,
    );

    if (!newUser) {
      throw new UserNotFoundException(entityId);
    }
    return newUser;
  };

  /**
   * Deletes a user by entityId
   *
   * @param {string} entityId - The entityId of the user to be deleted
   *
   * @throws {UserNotFoundException} If the user with the provided ID is not found
   */
  deleteUser = async (entityId: string): Promise<void> => {
    const result = await this.usersRepository.deleteOne({ entityId });

    if (result.deletedCount === 0) {
      throw new UserNotFoundException(entityId);
    }
  };
}
