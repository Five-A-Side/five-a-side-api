import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GenericAPIErrors } from '../errors/generic-api-errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if ((exception as any).errors instanceof Object) {
      const errors = Object.keys((exception as any).errors).map((key) => ({
        [key]: {
          name: (exception as any).errors[key].name,
          message: (exception as any).errors[key].message,
          properties: (exception as any).errors[key].properties,
          kind: (exception as any).errors[key].kind,
          path: (exception as any).errors[key].path,
          value: (exception as any).errors[key].value,
        },
      }));

      response.status(HttpStatus.BAD_REQUEST).json({
        code: GenericAPIErrors.InternalErrorCode.BAD_REQUEST,
        errors,
      });
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        code: GenericAPIErrors.InternalErrorCode.BAD_REQUEST,
        errors: exception.getResponse(),
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: GenericAPIErrors.InternalErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }
}
