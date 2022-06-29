export class GameModel {
    idGame: string;
    players: { userId: string, isWhite: boolean, isReady: boolean }[] | null;
    isMultiplayer: boolean | null;
    board: string | null;
    status: string | null;
    winnerId: string | null;
    dateGame: Date | null;
}
