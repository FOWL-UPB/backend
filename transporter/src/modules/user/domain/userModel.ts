export class UserModel {
    idUser: string;
    userName: string | null;
    profileUrl: string | null;
    theme: string | null;
    ads: boolean | null;
    email: string | null;
    password: string | null;
    level: { played: number, won: number }[] | null;
}