import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CreateUserRequest } from '../../dto/create-user.request';
import { UpdateUserRequest } from '../../dto/update-user.request';
import { Types } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { UsersController } from '../../users.controller';
import { UsersService } from '../../users.service';
import { UsersRepository } from '../../users.repository';
import { UserAlreadyExistsException } from '../../../common/exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../../../common/exceptions/user-not-found.exception';
import { Bcrypt } from '../../../common/utils/bcrypt';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const userStub = (): User => {
    return {
      _id: new Types.ObjectId('63e4e98efbe00c46646bdb10'),
      entityId: '123',
      name: 'test-name',
      username: 'test-username',
      email: 'test@example.com',
      password: 'test-password',
    };
  };

  const createUserDto = (): CreateUserRequest => {
    return {
      name: 'test-name',
      username: 'test-username',
      email: 'test@example.com',
      password: 'test-password',
    };
  };

  const invalidCreateUserDto = (): CreateUserRequest => {
    return {
      name: '',
      username: 'test-username',
      email: 'test@example.com',
      password: 'test-password',
    };
  };

  const updateUserDto = (): UpdateUserRequest => {
    return {
      name: 'test-name',
      email: 'test@example.com',
      password: 'test-password',
    };
  };

  const invalidUpdateUserDto = (): UpdateUserRequest => {
    return {
      name: 'test-name',
      email: 'test@example.com',
      password: 'test-password',
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        Bcrypt,
        UsersRepository,
        {
          provide: UsersRepository,
          useValue: {
            findOne: jest.fn().mockResolvedValue(userStub()),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when trying to create a user', () => {
      describe('when the user is already created with the email provided', () => {
        beforeEach(async () => {
          jest.spyOn(usersService, 'createUser').mockImplementation(() => {
            return Promise.reject(
              new UserAlreadyExistsException(createUserDto().email),
            );
          });
        });

        test('then is should throw a UserAlreadyExistsException', async () => {
          await expect(
            usersController.create(createUserDto()),
          ).rejects.toThrowError(
            `User with email test@example.com already exists`,
          );
        });
      });

      describe('when the create user payload is not valid', () => {
        beforeEach(async () => {
          jest.spyOn(usersService, 'createUser').mockImplementation(() => {
            return Promise.reject(new BadRequestException());
          });
        });

        test('then is should throw a BadRequestException', async () => {
          await expect(
            usersController.create(invalidCreateUserDto()),
          ).rejects.toThrowError();
        });
      });

      describe('when the create user payload valid', () => {
        beforeEach(async () => {
          jest
            .spyOn(usersService, 'createUser')
            .mockImplementation(() => Promise.resolve(userStub()));
        });

        test('then is should create and return th user', async () => {
          const user: User = await usersController.create(createUserDto());
          expect(user).toEqual(userStub());
        });
      });
    });
  });

  describe('list', () => {
    describe('when trying to list all the users', () => {
      describe('when the users list is empty', () => {
        beforeEach(async () => {
          jest
            .spyOn(usersService, 'list')
            .mockImplementation(() => Promise.resolve([]));
        });
        test('then is should return an empty list of users', async () => {
          const users: User[] = await usersController.list();
          expect(users).toEqual([]);
        });
      });

      describe('when there are users created', () => {
        beforeEach(async () => {
          jest
            .spyOn(usersService, 'list')
            .mockImplementation(() => Promise.resolve([userStub()]));
        });
        test('then is should return the list of created users', async () => {
          const users: User[] = await usersController.list();
          expect(users).toEqual([userStub()]);
        });
      });
    });
  });

  describe('getUser', () => {
    describe('when trying to get a user', () => {
      describe('when the user does not exists', () => {
        beforeEach(async () => {
          jest.spyOn(usersService, 'findByEntityId').mockImplementation(() => {
            return Promise.reject(
              new UserNotFoundException(userStub().entityId),
            );
          });
        });

        test('then is should throw a UserNotFoundException', async () => {
          await expect(
            usersController.getUser(userStub().entityId),
          ).rejects.toThrowError(`User with id 123 not found`);
        });
      });

      describe('when the user exists', () => {
        beforeEach(async () => {
          jest
            .spyOn(usersService, 'findByEntityId')
            .mockImplementation(() => Promise.resolve(userStub()));
        });

        test('then is should return a user', async () => {
          const user: User = await usersController.getUser(userStub().entityId);
          expect(user).toEqual(userStub());
        });
      });
    });
  });

  describe('updateUser', () => {
    describe('when trying to update a user', () => {
      describe('when the user does not exists', () => {
        beforeEach(async () => {
          jest.spyOn(usersService, 'updateUser').mockImplementation(() => {
            return Promise.reject(
              new UserNotFoundException(userStub().entityId),
            );
          });
        });

        test('then is should throw a UserNotFoundException', async () => {
          await expect(
            usersController.updateUser(userStub().entityId, updateUserDto()),
          ).rejects.toThrowError(`User with id 123 not found`);
        });
      });

      describe('when the user exists', () => {
        describe('when the updated user payload is not valid', () => {
          beforeEach(async () => {
            jest.spyOn(usersService, 'updateUser').mockImplementation(() => {
              return Promise.reject(new BadRequestException());
            });
          });

          test('then is should throw a BadRequestException', async () => {
            await expect(
              usersController.updateUser(
                userStub().entityId,
                invalidUpdateUserDto(),
              ),
            ).rejects.toThrowError();
          });
        });

        describe('when the user with the same email already exists', () => {
          beforeEach(async () => {
            jest.spyOn(usersService, 'updateUser').mockImplementation(() => {
              return Promise.reject(
                new UserAlreadyExistsException(updateUserDto().email),
              );
            });
          });

          test('then is should throw a UserAlreadyExistsException', async () => {
            await expect(
              usersController.updateUser(userStub().entityId, updateUserDto()),
            ).rejects.toThrowError(
              `User with email test@example.com already exists`,
            );
          });
        });

        describe('when the user with the same email does not exists and is valid to update', () => {
          beforeEach(async () => {
            jest
              .spyOn(usersService, 'updateUser')
              .mockImplementation(() => Promise.resolve(userStub()));
          });

          test('then is should return a user', async () => {
            const user: User = await usersController.updateUser(
              userStub().entityId,
              updateUserDto(),
            );
            expect(user).toEqual(userStub());
          });
        });
      });
    });
  });

  describe('removeUser', () => {
    describe('when trying to delete a user', () => {
      describe('when the user does not exists', () => {
        beforeEach(async () => {
          jest.spyOn(usersService, 'deleteUser').mockImplementation(() => {
            return Promise.reject(
              new UserNotFoundException(userStub().entityId),
            );
          });
        });

        test('then is should throw a UserNotFoundException', async () => {
          await expect(
            usersController.removeUser(userStub().entityId),
          ).rejects.toThrowError(`User with id 123 not found`);
        });
      });

      describe('when the user exists', () => {
        beforeEach(async () => {
          jest
            .spyOn(usersService, 'deleteUser')
            .mockImplementation(() => Promise.resolve());
        });

        test('then is should delete the user', async () => {
          const user = await usersController.removeUser(userStub().entityId);
          expect(user).toBeNull;
        });
      });
    });
  });
});
