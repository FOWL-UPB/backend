import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModelService } from './service/userModel.service';

require("dotenv").config();

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserModelService
    ])
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}