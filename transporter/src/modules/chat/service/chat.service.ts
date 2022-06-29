import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ChatService {
    private _client: ClientProxy;

    constructor() {
        this._client = ClientProxyFactory.create({
            transport: Transport.REDIS,
            options: {
                url: 'redis://localhost:6379'
            }
        })
    }

    async rescureAllMessageGet(id): Promise<any> {
        return await this._client.send('rescureAllMessageGet', id).toPromise();
    }

    async saveMessage({ idUser, idGame, ipd }): Promise<any> {
        return await this._client.send('saveMessage', { idUser, idGame, ipd }).toPromise();
    }
}
