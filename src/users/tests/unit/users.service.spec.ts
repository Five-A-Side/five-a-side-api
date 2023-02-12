import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import {
  userStub,
  userStub2,
  createUserDto,
  invalidCreateUserDto,
  updateUserDto,
  invalidUpdateUserDto,
} from '../stubs/user.stub';
import { User } from '../../schemas/user.schema';
import { UsersService } from '../../users.service';
import { UsersRepository } from '../../users.repository';
import { Bcrypt } from '../../../common/utils/bcrypt';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        Bcrypt,
        {
          provide: UsersRepository,
          useValue: {
            findOne: jest.fn().mockResolvedValue(userStub()),
            find: jest.fn().mockResolvedValue([userStub()]),
            deleteOne: jest.fn().mockResolvedValue(userStub()),
            findOneAndUpdate: jest.fn().mockResolvedValue(userStub()),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    describe('when trying to create a user', () => {
      describe('when the user is already created with the email provided', () => {
        beforeEach(async () => {
          jest
            .spyOn(usersRepository, 'findOne')
            .mockImplementation(() => Promise.resolve(userStub()));
        });

        test('then is should throw a UserAlreadyExistsException', async () => {
          await expect(
            usersService.createUser(createUserDto()),
          ).rejects.toThrowError(
            `User with email test@example.com already exists`,
          );
        });
      });

      describe('when the username has been already taken', () => {
        beforeEach(async () => {
          jest
            .spyOn(usersRepository, 'findOne')
            .mockImplementation((filterQuery) => {
              if (filterQuery.email) {
                return null;
              } else {
                return Promise.resolve(userStub());
              }
            });
        });

        test('then is should throw a UsernameAlreadyTakenException', async () => {
          await expect(
            usersService.createUser(createUserDto()),
          ).rejects.toThrowError(
            `That username test-username has already been taken`,
          );
        });
      });

      describe('when the create user payload is not valid', () => {
        beforeEach(async () => {
          jest.spyOn(usersRepository, 'findOne').mockImplementation(() => {
            return null;
          });

          jest.spyOn(usersService, 'createUser').mockImplementation(() => {
            return Promise.reject(new BadRequestException());
          });
        });

        test('then is should throw a BadRequestException', async () => {
          await expect(
            usersService.createUser(invalidCreateUserDto()),
          ).rejects.toThrowError();
        });
      });

      describe('when the create user payload valid', () => {
        beforeEach(async () => {
          jest.spyOn(usersRepository, 'findOne').mockImplementation(() => {
            return null;
          });
          jest
            .spyOn(usersService, 'createUser')
            .mockImplementation(() => Promise.resolve(userStub()));
        });

        test('then is should create and return the user', async () => {
          const user: User = await usersService.createUser(createUserDto());
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
            .spyOn(usersRepository, 'find')
            .mockImplementation(() => Promise.resolve([]));
        });

        test('then is should return an empty list of users', async () => {
          const users: User[] = await usersService.list();
          expect(users).toEqual([]);
        });
      });

      describe('when there are users created', () => {
        test('then is should return the list of created users', async () => {
          const users: User[] = await usersService.list();
          expect(users).toEqual([userStub()]);
        });
      });
    });
  });

  describe('getUser', () => {
    describe('when trying to get a user', () => {
      describe('when the user does not exists', () => {
        beforeEach(async () => {
          jest.spyOn(usersRepository, 'findOne').mockImplementation(() => {
            return null;
          });
        });

        test('then is should throw a UserNotFoundException', async () => {
          await expect(
            usersService.findByEntityId(userStub().entityId),
          ).rejects.toThrowError(`User with id 123 not found`);
        });
      });

      describe('when the user exists', () => {
        beforeEach(async () => {
          jest
            .spyOn(usersRepository, 'findOne')
            .mockImplementation(() => Promise.resolve(userStub()));
        });

        test('then is should return a user', async () => {
          const user: User = await usersService.findByEntityId(
            userStub().entityId,
          );
          expect(user).toEqual(userStub());
        });
      });
    });
  });

  describe('updateUser', () => {
    describe('when trying to update a user', () => {
      describe('when the user does not exists', () => {
        beforeEach(async () => {
          jest.spyOn(usersRepository, 'findOne').mockImplementation(() => {
            return null;
          });
        });

        test('then is should throw a UserNotFoundException', async () => {
          await expect(
            usersService.updateUser(userStub().entityId, updateUserDto()),
          ).rejects.toThrowError(`User with id 123 not found`);
        });
      });

      describe('when the user exists', () => {
        describe('when the updated user payload is not valid', () => {
          beforeEach(async () => {
            jest
              .spyOn(usersRepository, 'findOne')
              .mockImplementation(() => Promise.resolve(userStub()));
          });

          test('then is should throw a BadRequestException', async () => {
            await expect(
              usersService.updateUser(
                userStub().entityId,
                invalidUpdateUserDto(),
              ),
            ).rejects.toThrowError();
          });
        });

        describe('when the user with the same email already exists', () => {
          beforeEach(async () => {
            //jest.spyOn(usersRepository, 'findOne').mockImplementation(() => Promise.resolve(userStub()));
            jest
              .spyOn(usersRepository, 'findOne')
              .mockImplementation((filterQuery) => {
                if (filterQuery.email) {
                  return Promise.resolve(userStub2());
                } else {
                  return Promise.resolve(userStub());
                }
              });
          });

          test('then is should throw a UserAlreadyExistsException', async () => {
            await expect(
              usersService.updateUser(userStub().entityId, updateUserDto()),
            ).rejects.toThrowError(
              `User with email test2@example.com already exists`,
            );
          });
        });

        describe('when the user with the same email does not exists and is valid to update', () => {
          beforeEach(async () => {
            jest
              .spyOn(usersRepository, 'findOne')
              .mockImplementation((filterQuery) => {
                if (filterQuery.email) {
                  return null;
                } else {
                  return Promise.resolve(userStub());
                }
              });
          });

          test('then is should return a user', async () => {
            const user: User = await usersService.updateUser(
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
          jest.spyOn(usersRepository, 'deleteOne').mockImplementation(() => {
            return Promise.resolve({ acknowledged: true, deletedCount: 0 });
          });
        });

        test('then is should throw a UserNotFoundException', async () => {
          await expect(
            usersService.deleteUser(userStub().entityId),
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
          const user = await usersService.deleteUser(userStub().entityId);
          expect(user).toBeNull;
        });
      });
    });
  });
});
