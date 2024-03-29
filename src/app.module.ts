import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import database from './config/database';
import { People } from './modules/people/entities/people.entity';
import { Apartment } from './modules/apartments/entities/apartment.entity';
import { PeopleModule } from './modules/people/people.module';
import { User } from './modules/users/user.entity';
import { UserModule } from './modules/users/user.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import jwt from './config/jwt';
import { Owner } from './modules/apartments/entities/owner.entity';
import { ApartmentModule } from './modules/apartments/apartment.module';
import { FeeModule } from './modules/fee/fee.module';
import { Fee } from './modules/fee/entities/fee.entity';
import { Bill } from './modules/fee/entities/bill.entity';
import { TemporaryAbsent } from './modules/people/entities/temporary-absent.entity';
import { OptionalFee } from './modules/charity/entities/optional-fee.entity';
import { CharityFund } from './modules/charity/entities/charity-fund.entity';
import { CharityModule } from './modules/charity/charity.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './modules/tasks/task.module';
import { MailerModule } from '@nestjs-modules/mailer';
import mail from './config/mail';
import { appProvider } from './app.provider';
import { GuestModule } from './modules/guest/guest.module';
import { VehicleModule } from './modules/vehicles/vehicle.module';
import { Vehicle } from './modules/vehicles/vehicle.entity';
import thirdPartyKey from './config/third-party-key';
('./config/');
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database, jwt, mail, thirdPartyKey],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities: [
          People,
          Apartment,
          User,
          Owner,
          Fee,
          Bill,
          TemporaryAbsent,
          OptionalFee,
          CharityFund,
          Vehicle,
        ],
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('mail'),
    }),
    RouterModule.register([
      {
        path: 'api/v1/users',
        module: UserModule,
      },
      { path: 'api/v1/auth', module: AuthModule },
      { path: 'api/v1/apartments', module: ApartmentModule },
      { path: 'api/v1/people', module: PeopleModule },
      { path: 'api/v1/fee', module: FeeModule },
      { path: 'api/v1/charity', module: CharityModule },
      { path: 'api/v1/guest', module: GuestModule },
      { path: 'api/v1/vehicle', module: VehicleModule },
    ]),
    ScheduleModule.forRoot(),
    TaskModule,
    PeopleModule,
    UserModule,
    AuthModule,
    ApartmentModule,
    FeeModule,
    CharityModule,
    GuestModule,
    VehicleModule,
  ],
  controllers: [],
  providers: appProvider,
})
export class AppModule {}
