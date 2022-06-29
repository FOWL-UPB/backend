import { JwtService } from "@nestjs/jwt";
import { UserModel } from "./userModel";

const bcrypt = require('bcrypt');

export class UserLogic {
    private _jwtService: JwtService;
    constructor() {
        this._jwtService = new JwtService({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '604800s' }
        });
    }

    /**
     * signUp
     */
    public signUp(userName: string, email: string, passwordHash: string): UserModel {
        let user: UserModel = new UserModel();
        user.userName = userName;
        user.profileUrl = 'defaultURL';
        user.theme = 'defaultTheme';
        user.ads = true;
        user.email = email;
        user.password = passwordHash;
        user.level = [
            {
                played: 0,
                won: 0
            },
            {
                played: 0,
                won: 0
            }
        ]

        return user;
    }

    /**
     * generateJWT
     */
    public generateJWT(user: UserModel): string {
        return this._jwtService.sign({ user });
    }

    /**
     * hashPassword
     */
    public hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    /**
     * comparePasswords
     */
    public comparePasswords(newPassword: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(newPassword, passwordHash).then((result) => result);
    }
}