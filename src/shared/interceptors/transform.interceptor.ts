import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import {
  IResponse,
  ResponseStatus,
} from 'src/utils/interfaces/response.interfaces';

export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(
        (data): IResponse => ({
          status: ResponseStatus.SUCCESS,
          data,
        }),
      ),
    );
  }
}
