import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameModel } from '../domain/gameModel';

import { GameModelService } from './gameModel.service';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameModelService)
        private readonly _gameRepository: Repository<GameModelService>
    ) { }

    /**
     * getGame
     */
    public async getGames(): Promise<GameModel[]> {
        const aux = (await this._gameRepository.find()).filter(el => el.players.length == 1);

        return (aux).map(game => new GameModel(game));
    }

    /**
     * getGame
     */
    public async getGame(id: string): Promise<GameModel[]> {
        return (await this._gameRepository.find({ idGame: id })).map(game => new GameModel(game));
    }

    /**
     * saveGame
     */
    public async saveGame(game: GameModel): Promise<GameModel> {
        const gametest = await this._gameRepository.save(game.toGameModelService())

        return new GameModel(gametest);
    }
}
