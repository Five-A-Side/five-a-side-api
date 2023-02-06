import { HttpStatus, HttpException } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
  }
}
