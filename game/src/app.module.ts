import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './modules/game/game.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    GameModule,
    TypeOrmModule.forRoot({
      name: "default",
      type: "postgres",
      host: process.env.HOST,
      port: Number(process.env.PORT_DB),
      username: process.env.USER_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.DATABASE,
      synchronize: false,
      autoLoadEntities: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
