import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

import { UserNotFoundException } from '../user-not-found.exception';
import { APIErrors } from 'src/users/errors/api-errors';

@Catch(UserNotFoundException)
export class UserNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: UserNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.NOT_FOUND).json({
      code: APIErrors.InternalErrorCode.USER_NOT_FOUND,
      message: exception.message,
    });
  }
}
