import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot( {
      name: "default",
      type: "postgres",
      host: process.env.HOST,
      port: Number(process.env.PORT_DB),
      username: process.env.USER_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.DATABASE,
      synchronize: false,
      autoLoadEntities: true,
    }),
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
