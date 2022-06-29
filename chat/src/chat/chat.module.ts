import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './service/chat.service';
import { ChatController } from './controller/chat.controller';
import { Chat } from './domain/Chat';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Chat
    ])
  ],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}