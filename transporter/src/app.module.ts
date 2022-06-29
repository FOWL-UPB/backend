import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './modules/game/game.module';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [GameModule, UserModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
