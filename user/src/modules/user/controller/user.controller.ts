import { Controller, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserLogic } from '../domain/userLogic';
import { UserModel } from '../domain/userModel';
import { UserService } from '../service/user.service';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { MessagePattern } from '@nestjs/microservices';
import { BaseModel } from '../domain/baseModel';

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileImages',
        filename: (req, file, cb) => {
            const filename: string = uuidv4() + file.originalname;

            cb(null, `${filename}`);
        }
    })
}

@Controller('user')
export class UserController {
    private _userLogic: UserLogic;

    constructor(
        private readonly _userService: UserService
    ) {
        this._userLogic = new UserLogic();
    }

    @MessagePattern('signUp')
    async signUp({ userName, email, password }): Promise<BaseModel<{ token: string }>> {
        if (userName == null) {
            return new BaseModel<{ token: string }>(undefined, 'The userName parameter is required');
        } else if (email == null) {
            return new BaseModel<{ token: string }>(undefined, 'The email parameter is required');
        } else if (password == null) {
            return new BaseModel<{ token: string }>(undefined, 'The password parameter is required');
        } else {
            email = email.toLowerCase();
            const userExist: UserModel = await this._userService.getUser('', email);

            if (userExist) {
                return new BaseModel<{ token: string }>(undefined, 'User already exists');
            } else {
                const passwordHash: string = await this._userLogic.hashPassword(password);

                const user: UserModel = this._userLogic.signUp(userName, email, passwordHash);

                const userPromise: UserModel = await this._userService.saveUser(user);
                delete userPromise.password;

                return new BaseModel<{ token: string }>({ token: this._userLogic.generateJWT(userPromise) }, undefined);
            }
        }
    }

    @MessagePattern('signIn')
    async signIn({ email, password }): Promise<BaseModel<{ token: string }>> {
        if (email == null) {
            return new BaseModel<{ token: string }>(undefined, 'The email parameter is required');
        } else if (password == null) {
            return new BaseModel<{ token: string }>(undefined, 'The password parameter is required');
        } else {
            email = email.toLowerCase();
            const userExist: UserModel = await this._userService.getUser('', email);

            if (userExist) {
                const match = await this._userLogic.comparePasswords(password, userExist.password);

                if (match) {
                    delete userExist.password;
                    return new BaseModel<{ token: string }>({ token: this._userLogic.generateJWT(userExist) }, undefined);
                } else {
                    return new BaseModel<{ token: string }>(undefined, 'Incorrect password');
                }
            } else {
                return new BaseModel<{ token: string }>(undefined, 'User does not exist');
            }
        }
    }

    @MessagePattern('infoUser')
    async infoUser(id: string): Promise<BaseModel<UserModel>> {
        if (!id) {
            return new BaseModel<UserModel>(undefined, 'Unable to find the user');
        } else {
            return new BaseModel<UserModel>((await this._userService.infoUser(id)), undefined);
        }
    }

    @MessagePattern('uploadFile')
    // @UseInterceptors(FileInterceptor('file', storage))
    uploadFile({ userId, file, userName, theme }): any {
        if (file) {
            return this._userService.updateProfile(userId, file.filename, userName, theme).pipe(
                map((user: UserModel) => ({ profileUrl: user.profileUrl }))
            );
        } else if (userName) {
            return this._userService.updateProfile(userId, file, userName, theme).pipe(
                map((user: UserModel) => ({ userName: user.userName }))
            );
        } else if (theme) {
            return this._userService.updateProfile(userId, file, userName, theme).pipe(
                map((user: UserModel) => ({ theme: theme }))
            );
        }
    }
}
