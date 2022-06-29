import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class UserService {
    private _client: ClientProxy;

    constructor() {
        this._client = ClientProxyFactory.create({
            transport: Transport.REDIS,
            options: {
                url: 'redis://localhost:6379'
            }
        })
    }

    async signUp({ userName, email, password }): Promise<any> {
        return await this._client.send('signUp', { userName, email, password }).toPromise();
    }

    async signIn({ email, password }): Promise<any> {
        return await this._client.send('signIn', { email, password }).toPromise();
    }

    async infoUser(id): Promise<any> {
        return await this._client.send('infoUser', id).toPromise();
    }

    async uploadFile({ id, file, userName, theme }): Promise<any> {
        return await this._client.send('uploadFile', { id, file, userName, theme }).toPromise();
    }
}
