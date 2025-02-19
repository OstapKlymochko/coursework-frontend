import {ILogin} from "./ILogin";

export interface IRegister extends ILogin {
    username: string,
    role: 'User' | 'Author'
}