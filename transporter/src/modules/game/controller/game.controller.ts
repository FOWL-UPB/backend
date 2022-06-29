import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { GameModel } from '../domain/gameModel';
import { GameService } from '../service/game.service';

@Controller('game')
export class GameController {
    constructor(private readonly _gameService: GameService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getGames(): Promise<GameModel[]> {
        const response = await this._gameService.getGames();
        if (response.isOk) {
            return response.data;
        } else {
            throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getGame(@Param('id') id: string): Promise<GameModel> {
        const response = await this._gameService.getGame(id);
        if (response.isOk) {
            return response.data;
        } else {
            throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createGame(@Request() request, @Body('isMultiplayer') isMultiplayer: boolean): Promise<GameModel> {
        if (isMultiplayer != null) {
            const response = await this._gameService.createGame({ idUser: request.user.idUser, isMultiplayer: isMultiplayer });
            if (response.isOk) {
                return response.data;
            } else {
                throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new HttpException('The isMultiplayer parameter is required', HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    async updateGame(@Request() request, @Param('id') id: string, @Body() { isWhite, isReady }): Promise<GameModel> {
        if (isWhite != null && isReady != null) {
            const response = await this._gameService.updateGame({ idUser: request.user.idUser, idGame: id, isReady: isReady, isWhite: isWhite });
            if (response.isOk) {
                return response.data;
            } else {
                throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
            }
        } else if (isWhite != null) {
            throw new HttpException('The isReady parameter is required', HttpStatus.BAD_REQUEST);
        } else if (isReady != null) {
            throw new HttpException('The isWhite parameter is required', HttpStatus.BAD_REQUEST);
        } else {
            const response = await this._gameService.joinGame({ idUser: request.user.idUser, idGame: id });
            if (response.isOk) {
                return response.data;
            } else {
                throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/:id')
    async playGame(@Request() request, @Param('id') idGame: string, @Body() { from, to }): Promise<GameModel> {
        if (from != null && to != null) {
            const response = await this._gameService.playGame({ idUser: request.user.idUser , idGame: idGame, from: from, to: to });
            if (response.isOk) {
                return response.data;
            } else {
                throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
            }
        } else if (from != null) {
            throw new HttpException('The to parameter is required', HttpStatus.BAD_REQUEST);
        } else if (to != null) {
            throw new HttpException('The from parameter is required', HttpStatus.BAD_REQUEST);
        } else {
            const response = await this._gameService.exitGame({ idUser: request.user.idUser, idGame: idGame });
            if (response.isOk) {
                return response.data;
            } else {
                throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
            }
        }
    }
}
