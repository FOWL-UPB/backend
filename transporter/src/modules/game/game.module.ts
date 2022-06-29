import { Module } from '@nestjs/common';
import { GameService } from './service/game.service';
import { GameController } from './controller/game.controller';
import { JwtAuthGuard } from '../auth/auth.guard';
import { JwtStrategy } from '../auth/auth.strategy';

@Module({
  providers: [GameService, JwtAuthGuard, JwtStrategy],
  controllers: [GameController]
})
export class GameModule {}
