import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { GameModel } from '../domain/gameModel';

@Injectable()
export class GameService {
    private _client: ClientProxy;

    constructor() {
        this._client = ClientProxyFactory.create({
            transport: Transport.REDIS,
            options: {
                url: 'redis://localhost:6379'
            }
        })
    }

    async getGame(id: string): Promise<any> {
        return await this._client.send<any, string>('getGame', id).toPromise();
    }

    async getGames(): Promise<any> {
        return await this._client.send<any, {}>('getGames', {}).toPromise();
    }

    async createGame({ idUser, isMultiplayer }: { idUser: string, isMultiplayer: boolean }): Promise<any> {
        return await this._client.send<any, { idUser: string, isMultiplayer: boolean }>('createGame', { idUser, isMultiplayer }).toPromise();
    }

    async updateGame({ idUser, idGame, isWhite, isReady }: { idUser: string, idGame: string, isWhite: boolean, isReady: boolean }): Promise<any> {
        return await this._client.send<any, { idUser: string, idGame: string, isWhite: boolean, isReady: boolean }>('updateGame', { idUser, idGame, isWhite, isReady }).toPromise();
    }

    async joinGame({ idUser, idGame }: { idUser: string, idGame: string }): Promise<any> {
        return await this._client.send<any, { idUser: string, idGame: string }>('joinGame', { idUser, idGame }).toPromise();
    }

    async playGame({ idUser, idGame, from, to }: { idUser: string, idGame: string, from, to }): Promise<any> {
        return await this._client.send<any, { idUser: string, idGame: string, from, to }>('playGame', { idUser, idGame, from, to }).toPromise();
    }

    async exitGame({ idUser, idGame }: { idUser: string, idGame: string }): Promise<any> {
        return await this._client.send<any, { idUser: string, idGame: string }>('exitGame', { idUser, idGame }).toPromise();
    }
}
