import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorMessage } from 'src/utils/enums/message/error';
import { ResponseStatus } from 'src/utils/interfaces/response.interfaces';

// @Catch(UnauthorizedException)
// export class UnauthorizedExceptionFilter implements ExceptionFilter {
//   catch(exception: UnauthorizedException, host: ArgumentsHost) {
//     const message =
//       exception.message != 'Unauthorized'
//         ? exception.message
//         : ErrorMessage.INVALID_TOKEN;
//     const status = exception.getStatus();
//     const res: Response = host.switchToHttp().getResponse();
//     return res.status(status).json({ status: ResponseStatus.FAIL, message });
//   }
// }

// @Catch(ForbiddenException)
// export class ForbiddenExceptionFilter implements ExceptionFilter {
//   catch(exception: ForbiddenException, host: ArgumentsHost) {
//     const status = exception.getStatus();
//     const res: Response = host.switchToHttp().getResponse();
//     return res.status(status).json({
//       status: ResponseStatus.FAIL,
//       message: ErrorMessage.FORBIDDEN_RESOURCE,
//     });
//   }
// }

// @Catch(BadRequestException)
// export class BadRequestExceptionFilter implements ExceptionFilter {
//   catch(exception: BadRequestException, host: ArgumentsHost) {
//     const message = exception.getResponse() as any;
//     const status = exception.getStatus();
//     const res: Response = host.switchToHttp().getResponse();
//     return res
//       .status(status)
//       .json({ status: ResponseStatus.FAIL, message: message.message });
//   }
// }

// @Catch(NotFoundException, ConflictException)
// export class NotFoundOrConflictExceptionFilter implements ExceptionFilter {
//   catch(exception: NotFoundException | ConflictException, host: ArgumentsHost) {
//     const message = exception.message;
//     const status = exception.getStatus();
//     const res: Response = host.switchToHttp().getResponse();
//     return res.status(status).json({ status: ResponseStatus.FAIL, message });
//   }
// }

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    let message = undefined;
    const status = exception.getStatus();
    const res: Response = host.switchToHttp().getResponse();
    switch (true) {
      case exception instanceof UnauthorizedException:
        message =
          exception.message != 'Unauthorized'
            ? exception.message
            : ErrorMessage.INVALID_TOKEN;
        break;
      case exception instanceof ForbiddenException:
        message = ErrorMessage.FORBIDDEN_RESOURCE;
        break;
      case exception instanceof BadRequestException:
        message = (exception.getResponse() as any).message;
        break;
      default:
        message = exception.message;
    }
    return res.status(status).json({ status: ResponseStatus.FAIL, message });
  }
}
