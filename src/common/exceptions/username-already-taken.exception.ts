import { HttpStatus, HttpException } from '@nestjs/common';

export class UsernameAlreadyTakenException extends HttpException {
  constructor(username: string) {
    super(
      `That username ${username} has already been taken`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
