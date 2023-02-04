import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './schemas/user.schema';
import { DatabaseModule } from '../../libs/common/src/index';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../config/configuration';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get('database.uri'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository]
})


@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository]
})
export class UsersModule { }
