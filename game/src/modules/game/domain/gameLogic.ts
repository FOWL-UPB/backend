import { Chess, ChessInstance, ShortMove } from "chess.js";

import { GameModel } from "./gameModel";
import { BaseModel } from "./baseModel";

export class GameLogic {
    /**
     * createGame
     */
    public createGame(userId: string, isMultiplayer: boolean): GameModel {
        let game: GameModel = new GameModel();
        game.players = [{
            userId: userId,
            isWhite: true,
            isReady: false
        }];
        game.isMultiplayer = isMultiplayer;
        game.board = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        game.status = 'New game'
        game.winnerId = '';
        game.dateGame = new Date();

        return game;
    }

    /**
     * getGameFromGames
     */
    public getGameFromGames(games: GameModel[]): BaseModel<GameModel> {
        if (games.length == 1) {
            return new BaseModel<GameModel>(games[0], undefined)
        } else {
            return new BaseModel<GameModel>(undefined, 'Game not found');
        }
    }

    /**
     * getGame
     */
    public getGames(games: GameModel[]): BaseModel<GameModel[]> {
        if (games) {
            return new BaseModel<GameModel[]>(games, undefined)
        } else {
            return new BaseModel<GameModel[]>(undefined, 'Error');
        }
    }

    /**
     * getGame
     */
    public getGame(games: GameModel): BaseModel<GameModel> {
        if (games) {
            return new BaseModel<GameModel>(games, undefined)
        } else {
            return new BaseModel<GameModel>(undefined, 'Error');
        }
    }

    /**
     * joinGame
     */
    public joinGame(game: GameModel, userId: string): BaseModel<GameModel> {
        if (game.isMultiplayer) {
            if (game.players[0].userId != userId && game.players[1] ? (game.players[1].userId != userId) : true) {
                if (game.players.length < 2) {
                    game.players.push({ userId: userId, isWhite: false, isReady: false });

                    return new BaseModel<GameModel>(game, undefined);
                } else {
                    return new BaseModel<GameModel>(undefined, 'The game is complete');
                }
            } else {
                return new BaseModel<GameModel>(undefined, 'You are already in the game');
            }
        } else {
            return new BaseModel<GameModel>(undefined, 'The game in not multiplayer');
        }
    }

    /**
     * updateGame
     */
    public updateGame(game: GameModel, isWhite: boolean, isReady: boolean, userId: string): BaseModel<GameModel> {
        if (game.players.find(user => user.userId == userId)) {
            game.players.map(user => {
                if (game.isMultiplayer) {
                    if (game.players.length == 2) {
                        if (!(game.players[0].isReady || game.players[1].isReady)) {
                            if (user.userId == userId) {
                                user.isWhite = isWhite;
                            } else {
                                user.isWhite = !isWhite;
                            }
                        }
                    } else {
                        return new BaseModel<GameModel>(undefined, 'The game is incomplete');
                    }
                } else {
                    if (!game.players[0].isReady) {
                        if (user.userId == userId) {
                            user.isWhite = isWhite;
                        }
                    }

                }
            });
            game.players.map(user => {
                if (user.userId == userId) {
                    user.isReady = isReady;
                }
            });
            return new BaseModel<GameModel>(game, undefined);
        } else {
            return new BaseModel<GameModel>(undefined, 'You are not in the game');
        }
    }

    /**
     * exitGame
     */
    public exitGame(game: GameModel, userId: string): BaseModel<GameModel> {
        if (game.players.find(user => user.userId == userId)) {
            if (game.winnerId == '') {
                const userWinner = game.players.filter(user => user.userId != userId);
                if (userWinner.length == 1) {
                    game.winnerId = userWinner[0].userId;
                } else {
                    game.winnerId = 'AI';
                }
                game.status = `Game over`;

                return new BaseModel<GameModel>(game, undefined);
            } else {
                return new BaseModel<GameModel>(undefined, 'The game is over');
            }
        } else {
            return new BaseModel<GameModel>(undefined, 'You are not in the game');
        }
    }

    /**
     * playGame
     */
    public playGame(userId: string, gameResponse: GameModel, move: ShortMove): BaseModel<GameModel> {
        if (gameResponse.players[0].isReady && (gameResponse.players[1]?.isReady ?? true)) {
            let game = new Chess(gameResponse.board);

            if (!game.game_over() && gameResponse.winnerId == '') {
                
                if (gameResponse.players.filter(el => el.userId == userId).length != 0) {

                    if (gameResponse.players.filter(el => el.userId == userId)[0].isWhite == (gameResponse.board.split(' ')[1] == 'w')) {
                        const moveResult = game.move({
                            from: move.from,
                            to: move.to,
                            promotion: move.promotion
                        });
        
                        if (moveResult) {
                            this._setStatus(game, gameResponse);
        
                            gameResponse.board = game.fen();
        
                            if (!gameResponse.isMultiplayer && !game.game_over()) {
                                const possibleMoves = game.moves();
        
                                const randomIdx = Math.floor(Math.random() * possibleMoves.length);
                                game.move(possibleMoves[randomIdx]);
        
                                this._setStatus(game, gameResponse);
        
                                gameResponse.board = game.fen();
                            }
        
                            return new BaseModel<GameModel>(gameResponse, undefined);
                        } else {
                            return new BaseModel<GameModel>(undefined, 'Move not allowed');
                        }
                    } else {
                        return new BaseModel<GameModel>(undefined, 'Is not your turn');
                    }
                } else {
                    return new BaseModel<GameModel>(undefined, 'You are not in the game')
                }
            } else {
                return new BaseModel<GameModel>(undefined, 'The game is over');
            }
        } else {
            return new BaseModel<GameModel>(undefined, 'There is a player who is not ready yet');
        }
    }

    private _setStatus(game: ChessInstance, gameResponse: GameModel): void {
        let moveColor: string = 'White';
        let isWhiteWinner = false;
        if (game.turn() == 'b') {
            moveColor = 'Black';
            isWhiteWinner = true;
        }

        if (game.in_checkmate()) {
            gameResponse.status = `Game over, ${moveColor} is in checkmate`;

            const userWinner = gameResponse.players.filter(user => isWhiteWinner == user.isWhite);
            if (userWinner.length == 1) {
                gameResponse.winnerId = userWinner[0].userId;
            } else {
                gameResponse.winnerId = 'AI';
            }
        } else if (game.in_draw()) {
            gameResponse.status = `Game over, drawn position`;

            gameResponse.winnerId = 'drawn';
        } else {
            gameResponse.status = `${moveColor} to move`;
            if (game.in_check()) {
                gameResponse.status = `${moveColor} is in check`;
            }
        }
    }
}