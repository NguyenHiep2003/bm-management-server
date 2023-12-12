import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import database from './config/database';
import { People } from './modules/people/people.entity';
import { Apartment } from './entities/apartment';
import { PeopleModule } from './modules/people/people.module';
import { User } from './modules/users/user.entity';
import { UserModule } from './modules/users/user.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import jwt from './config/jwt';

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
        entities: [People, Apartment, User],
      }),
    }),
    RouterModule.register([
      {
        path: 'api/v1/account',
        module: UserModule,
      },
      { path: 'api/v1/auth', module: AuthModule },
    ]),
    PeopleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
