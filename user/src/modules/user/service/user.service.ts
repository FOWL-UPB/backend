import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserModel } from '../domain/userModel';
import { UserModelService } from './userModel.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserModelService)
        private readonly _userRepository: Repository<UserModelService>
    ) { }

    /**
     * getUser
     */
    public async getUser(id: string, email?: string): Promise<UserModel> {
        if (email) {
            return (await this._userRepository.find({ email: email })).map(game => new UserModel(game)).shift();
        } else {
            return (await this._userRepository.find({ idUser: id })).map(game => new UserModel(game)).shift();
        }
    }

    /**
     * saveUser
     */
    public async saveUser(user: UserModel): Promise<UserModel> {
        const userResponse = await this._userRepository.save(user.toUserModelService());
        return new UserModel(userResponse);
    }

    /**
     * infoUser
    */ 
    public async infoUser(id: string): Promise<any> {
        const getUserId =  (await this._userRepository.findOne({idUser: id}));
        const user = getUserId.userName;
        const lvl = getUserId.level; 
        return {
            userName: user,
            level: lvl.map(e => JSON.parse(e))
        };
    }

    /**
     * updateProfile
    */ 
    updateProfile(id: string, photo?: string, username?: string, theme?: string): Observable<any>{
        if(photo){
            return from(this._userRepository.update(id, {profileUrl: photo})).pipe(
                switchMap(() => this.getOne(id))
            );
        } else if (username){
            return from(this._userRepository.update(id, {userName: username})).pipe(
                switchMap(() => this.getOne(id))
            );
        } else if (theme){
            return from(this._userRepository.update(id, {theme: theme})).pipe(
                switchMap(() => this.getOne(id))
            );
        }    
    }

    public async getOne(id: string): Promise<any>{
        const getUserId = (await this._userRepository.find({idUser: id})).shift();
        return getUserId;
    }
}
