export class BaseModel<T> {
    isOk: boolean;

    constructor(public data?: T, public message?: string) {
        if (data) {
            this.isOk = true;
        } else {
            this.isOk = false;
        }
    }
}