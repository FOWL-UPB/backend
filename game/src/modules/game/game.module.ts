import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameModelService } from 'src/modules/game/service/gameModel.service';

import { GameController } from './controller/game.controller';
import { GameService } from './service/game.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GameModelService
        ])
    ],
    controllers: [GameController],
    providers: [GameService]
})
export class GameModule { }
