import { Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './shared/filers/http.filter';
import { AllExceptionFilter } from './shared/filers/anything.filter';

export const appProvider: Provider[] = [
  { provide: APP_FILTER, useClass: AllExceptionFilter },
  { provide: APP_FILTER, useClass: HttpExceptionFilter },
  { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
];
