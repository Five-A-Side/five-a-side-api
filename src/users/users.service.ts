import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UpdateUserRequest } from './dto/update-user.request';
import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';
import { UserAlreadyExistsException } from '../common/exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../common/exceptions/user-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository
  ) { }

  /**
   * Creates a new user based on the provided request information
   *
   * @param {CreateUserRequest} request - The request containing the information to create a new user
   * @returns {Promise<User>} A Promise that resolves to the newly created user
   * @throws {UserAlreadyExistsException} If a user with the same email already exists
   */
  createUser = async (request: CreateUserRequest): Promise<User> => {
    let email: string = request.email;

    if (await this.existsByEmail(email)) {
      throw new UserAlreadyExistsException(email);
    }

    const session = await this.usersRepository.startTransaction();
    try {
      const user = await this.usersRepository.create(request);
      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  /**
   * Retrieves the list of all users
   * 
   * @returns {Promise<User[]>} A promise that resolves to an array of users
   */
  list = async (): Promise<User[]> => {
    const session = await this.usersRepository.startTransaction();
    const users: User[] = await this.usersRepository.find({});
    await session.commitTransaction();
    return users;
  }

  /**
   * Retrieve a user by entityId
   * 
   * @param {string} entityId - entityId of the user to retrieve
   * @returns {Promise<User>} - Promise resolving to the retrieved user
   * @throws {UserNotFoundException} - Thrown if no user is found with the given ID
   */
  findByEntityId = async (entityId: string): Promise<User> => {
    const session = await this.usersRepository.startTransaction();
    try {
      const user: User = await this.usersRepository.findOne({ entityId });
      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw new UserNotFoundException(entityId);
    }
  }

  /**
   * Updates a user by entityId
   * 
   * @param {string} entityId - The entityId of the user to be updated
   * @param {UpdateUserRequest} request - The request containing the information to update a user
   * @returns {Promise<User>} - Promise resolving to the updated user
   * @throws {UserNotFoundException} - Thrown if no user is found with the given ID
   * @throws {UserAlreadyExistsException} - Thrown if a user with the same email already exists
   */
  updateUser = async (entityId: string, request: UpdateUserRequest): Promise<User> => {
    const user: User = await this.findByEntityId(entityId);
    const email: string = request.email;

    if (user.email !== request.email && await this.existsByEmail(email)) {
      throw new UserAlreadyExistsException(email);
    }

    const session = await this.usersRepository.startTransaction();
    try {
      const user = await this.usersRepository.findOneAndUpdate({ entityId }, request);
      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw new UserNotFoundException(entityId);
    }
  }

  /**
   * Deletes a user by entityId
   *
   * @param {string} entityId - The entityId of the user to be deleted
   *
   * @throws {UserNotFoundException} If the user with the provided ID is not found
   */
  deleteUser = async (entityId: string) => {
    const session = await this.usersRepository.startTransaction();
    try {
      await this.usersRepository.deleteOne({ entityId });
      await session.commitTransaction();
    } catch (error) {
      session.abortTransaction();
      throw new UserNotFoundException(entityId);
    }
  }

  /**
   * Checks if a user with the provided email already exists in the database
   *
   * @param {string} email - The user email to check
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating if the user exists or not
   */
  existsByEmail = async (email: string): Promise<boolean> => {
    let exists = true;
    const session = await this.usersRepository.startTransaction();

    try {
      await this.usersRepository.findOne({ email });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      exists = false;
    }
    console.log(exists);
    return exists;
  }
}
