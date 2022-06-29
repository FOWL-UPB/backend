import { UserModelService } from "../service/userModel.service";

export class UserModel {
    idUser: string;
    userName: string | null;
    profileUrl: string | null;
    theme: string | null;
    ads: boolean | null;
    email: string | null;
    password: string | null;
    level: { played: number, won: number }[] | null;

    constructor(userService?: UserModelService) {
        if (userService) {
            this.level = userService.level.map(element => JSON.parse(element));
            this.idUser = userService.idUser;
            this.userName = userService.userName;
            this.profileUrl = userService.profileUrl;
            this.theme = userService.theme;
            this.ads = userService.ads;
            this.email = userService.email;
            this.password = userService.password;
        }
    }

    toUserModelService(): UserModelService {
        let userService = new UserModelService();

        userService.level = this.level.map(element => JSON.stringify(element));
        userService.idUser = this.idUser;
        userService.userName = this.userName;
        userService.profileUrl = this.profileUrl;
        userService.theme = this.theme;
        userService.ads = this.ads;
        userService.email = this.email;
        userService.password = this.password;

        return userService;
    }
}