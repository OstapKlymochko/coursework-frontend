import {ILogin} from "../ILogin";
import {ITokenPair} from "../ITokenPair";
import {IRegister} from "../IRegister";
import {IUserData} from "../IUserData";
import {apiService, IRes} from "../../services";
import {IRequestPasswordReset} from "../IRequestPasswordReset";
import {IBasicResponse} from "../IBasicResponse";
import {IResetPassword} from "../IResetPassword";
import {IConfirmEmail} from "../IConfirmEmail";
import {urls} from "../../configs";

export interface IAuthService {
    login: (userData: ILogin) => IRes<ITokenPair>
    register: (userData: IRegister) => IRes<void>
    updateUser: (userData: IUserData) => IRes<IBasicResponse>
    me: () => IRes<IUserData>,
    requestPasswordReset: (identifier: IRequestPasswordReset) => IRes<IBasicResponse>,
    resetPassword: (resetData: IResetPassword) => IRes<IBasicResponse>,
    refresh: () => IRes<ITokenPair>,
    setTokens: (tokens: ITokenPair) => void,
    getAccessToken: () => string | null,
    getRefreshToken: () => string | null,
    deleteTokens: () => void,
    isAuthorized: () => boolean,
    confirmEmail: (confirmEmailPayload: IConfirmEmail) => IRes<IBasicResponse>,
    uploadAvatar: (avatar: FormData) => IRes<IBasicResponse>
}