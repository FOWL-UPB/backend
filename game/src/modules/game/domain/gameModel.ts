import { GameModelService } from "../service/gameModel.service";

export class GameModel {
    idGame: string;
    players: { userId: string, isWhite: boolean, isReady: boolean }[] | null;
    isMultiplayer: boolean | null;
    board: string | null;
    status: string | null;
    winnerId: string | null;
    dateGame: Date | null;

    constructor(gameService?: GameModelService) {
        if (gameService) {
            this.players = gameService.players.map(element => JSON.parse(element));
            this.isMultiplayer = gameService.isMultiplayer;
            this.board = gameService.board;
            this.status = gameService.status;
            this.winnerId = gameService.winnerId;
            this.dateGame = gameService.dateGame;
            this.idGame = gameService.idGame;
        }
    }

    toGameModelService(): GameModelService {
        let gameService = new GameModelService();

        gameService.players = this.players.map(element => JSON.stringify(element));
        gameService.isMultiplayer = this.isMultiplayer;
        gameService.board = this.board;
        gameService.status = this.status;
        gameService.winnerId = this.winnerId;
        gameService.dateGame = this.dateGame;
        gameService.idGame = this.idGame;

        return gameService;
    }
}
