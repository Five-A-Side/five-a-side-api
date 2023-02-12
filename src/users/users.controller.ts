import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/create-user.request';
import { UpdateUserRequest } from './dto/update-user.request';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user
   * @param request - Request body containing the user information to be created
   * @returns The newly created user
   * @throws An error if creating the user fails, it could be 400, 401, etc
   */
  @Post()
  @HttpCode(201)
  async create(@Body() request: CreateUserRequest): Promise<User> {
    return await this.usersService.createUser(request);
  }

  /**
   * Retrieves the list of all users
   *
   * @returns {Promise<User[]>} A promise that resolves to an array of users
   */
  @Get()
  async list(): Promise<User[]> {
    return await this.usersService.list();
  }

  /**
   * Find a User by ID.
   *
   * @param {string} id - The ID of the User
   * @returns {Promise<User>} - Returns a Promise of the User object with the given ID
   * @throws {UserNotFoundException} - Throws an error if the User with the given ID is not found
   */
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.findByEntityId(id);
  }

  /**
   * Update a user by id.
   *
   * @param {string} id - The id of the user to update.
   * @param {CreateUserRequest} request - The updated information for the user.
   * @returns {Promise<User>} The updated user.
   * @throws {NotFoundException} If the user could not be found.
   */
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() request: UpdateUserRequest,
  ): Promise<User> {
    return await this.usersService.updateUser(id, request);
  }

  /**
   * Deletes a user by id
   *
   * @param {string} id - The id of the user to delete
   * @throws Throws an error if the user with the given id does not exist
   *
   * @returns {void}
   */
  @Delete(':id')
  @HttpCode(204)
  async removeUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
