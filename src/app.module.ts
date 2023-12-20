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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database, jwt],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities: [People, Apartment, User, Owner, Fee],
      }),
    }),
    RouterModule.register([
      {
        path: 'api/v1/user',
        module: UserModule,
      },
      { path: 'api/v1/auth', module: AuthModule },
      { path: 'api/v1/apartment', module: ApartmentModule },
      { path: 'api/v1/people', module: PeopleModule },
      { path: 'api/v1/fee', module: FeeModule },
    ]),
    PeopleModule,
    UserModule,
    AuthModule,
    ApartmentModule,
    FeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
