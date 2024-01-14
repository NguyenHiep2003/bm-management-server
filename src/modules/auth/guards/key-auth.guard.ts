import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

export enum ThirdPartyService {
  INTERNET_SERVICE = 'Internet Service',
  WATER_SERVICE = 'Water Service',
  ELECTRICITY_SERVICE = 'Electricity Service',
}
@Injectable()
export class KeyAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req: Request = context.switchToHttp().getRequest();
      const key = req.headers['x-api-service-key'];
      const serviceName = req.headers.service;
      if (!key || !serviceName) return false;
      switch (serviceName) {
        case ThirdPartyService.ELECTRICITY_SERVICE: {
          const electricKey = this.configService.get(
            'thirdPartyKey.electricityServiceKey',
          );
          if (key !== electricKey) return false;
          else return true;
        }
        case ThirdPartyService.WATER_SERVICE: {
          const waterKey = this.configService.get(
            'thirdPartyKey.waterServiceKey',
          );
          if (key !== waterKey) return false;
          else return true;
        }
        case ThirdPartyService.INTERNET_SERVICE: {
          const internetKey = this.configService.get(
            'thirdPartyKey.internetServiceKey',
          );
          if (key !== internetKey) return false;
          else return true;
        }
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }
}
