import { Controller } from '@nestjs/common';

import { BaseModel } from '../domain/baseModel';
import { GameModel } from '../domain/gameModel';

import { GameLogic } from '../domain/gameLogic';

import { GameService } from '../service/game.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('game')
export class GameController {
    private _gameLogic: GameLogic;

    constructor(
        private readonly _gameService: GameService,
    ) {
        this._gameLogic = new GameLogic();
    }

    @MessagePattern('getGames')
    async getGames(): Promise<BaseModel<GameModel[]>> {
        const games: GameModel[] = await this._gameService.getGames();

        return this._gameLogic.getGames(games);
    }

    @MessagePattern('getGame')
    async getGame(id: string): Promise<BaseModel<GameModel>> {
        const games: GameModel[] = await this._gameService.getGame(id);

        return this._gameLogic.getGameFromGames(games);
    }

    @MessagePattern('createGame')
    async createGame({ idUser, isMultiplayer }: { idUser: string, isMultiplayer: boolean }): Promise<BaseModel<GameModel>> {
        const game: GameModel = await this._gameService.saveGame(this._gameLogic.createGame(idUser, isMultiplayer));

        return this._gameLogic.getGame(game);
    }

    @MessagePattern('updateGame')
    async updateGame({ idUser, idGame, isWhite, isReady }: { idUser: string, idGame: string, isWhite: boolean, isReady: boolean }): Promise<BaseModel<GameModel>> {
        const game: BaseModel<GameModel> = this._gameLogic.getGameFromGames(await this._gameService.getGame(idGame));

        if (game.isOk) {
            const gameUpdate = this._gameLogic.updateGame(game.data, isWhite, isReady, idUser);
            if (gameUpdate.isOk) {
                return this._gameLogic.getGame(await this._gameService.saveGame(gameUpdate.data));
            } else {
                return gameUpdate;
            }
        } else {
            return game;
        }
    }

    @MessagePattern('joinGame')
    async joinGame({ idUser, idGame }: { idUser: string, idGame: string }): Promise<BaseModel<GameModel>> {
        const game: BaseModel<GameModel> = this._gameLogic.getGameFromGames(await this._gameService.getGame(idGame));

        if (game.isOk) {
            const gameUpdate = this._gameLogic.joinGame(game.data, idUser);

            if (gameUpdate.isOk) {
                return this._gameLogic.getGame(await this._gameService.saveGame(gameUpdate.data));
            } else {
                return gameUpdate;
            }
        } else {
            return game;
        }
    }

    @MessagePattern('playGame')
    async playGame({ idUser, idGame, from, to }: { idUser: string, idGame: string, from, to }): Promise<BaseModel<GameModel>> {
        const game: BaseModel<GameModel> = this._gameLogic.getGameFromGames(await this._gameService.getGame(idGame));
        
        if (game.isOk) {
            const gameUpdate = this._gameLogic.playGame(idUser, game.data, { from: from, to: to, promotion: 'q' });

            if (gameUpdate.isOk) {
                return this._gameLogic.getGame(await this._gameService.saveGame(gameUpdate.data));
            } else {
                return gameUpdate;
            }
        } else {
            return game;
        }
    }

    @MessagePattern('exitGame')
    async exitGame({ idUser, idGame }: { idUser: string, idGame: string }): Promise<BaseModel<GameModel>> {
        const game: BaseModel<GameModel> = this._gameLogic.getGameFromGames(await this._gameService.getGame(idGame));

        if (game.isOk) {
            const gameUpdate = this._gameLogic.exitGame(game.data, idUser);

            if (gameUpdate.isOk) {
                return this._gameLogic.getGame(await this._gameService.saveGame(gameUpdate.data));
            } else {
                return gameUpdate;
            }
        } else {
            return game;
        }
    }
}
