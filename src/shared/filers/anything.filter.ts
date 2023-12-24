import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorMessage } from 'src/utils/enums/message/error';
import { ResponseStatus } from 'src/utils/interfaces/response.interfaces';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const response: Response = host.switchToHttp().getResponse();
    const httpMessage =
      exception instanceof HttpException
        ? exception.message
        : ErrorMessage.INTERNAL_SERVER_ERROR;
    const status =
      httpStatus != HttpStatus.INTERNAL_SERVER_ERROR
        ? ResponseStatus.FAIL
        : ResponseStatus.ERROR;
    response.status(httpStatus).json({ status, message: httpMessage });
  }
}
