import {
    IAuthService,
    ILogin,
    IRegister,
    IRequestPasswordReset,
    IResetPassword,
    IUserData
} from "../interfaces";
import {apiService} from "./apiService";
import {urls} from "../configs";
import {IConfirmEmail} from "../interfaces/IConfirmEmail";

const accessTokenKey = 'accessToken';
const refreshTokenKey = 'refreshToken';
export const authService: IAuthService = {
    login: async function (userData: ILogin) {
        const response = await apiService.post(urls.auth.login, {...userData});
        if (response.status === 200) {
            this.setTokens(response.data);
        }
        return response.data;
    },
    refresh: async function () {
        const refresh = this.getRefreshToken();
        const response = await apiService.get(urls.auth.refresh, {
            headers: {
                Authorization: 'Bearer ' + refresh
            }
        });
        if (response.status === 200) {
            this.setTokens(response.data);
        }
        return response;
    },
    updateUser: (userData: IUserData) => apiService.put(urls.auth.update, userData),
    requestPasswordReset: (identifier: IRequestPasswordReset) => apiService.post(urls.auth.requestPasswordReset, identifier),
    resetPassword: (resetData: IResetPassword) => apiService.put(urls.auth.resetPassword, resetData),
    register: (userData: IRegister) => apiService.post(urls.auth.register, userData),
    me: () => apiService.get(urls.auth.me),
    confirmEmail: (confirmEmailPayload: IConfirmEmail) => apiService.post(urls.auth.confirm, confirmEmailPayload),
    setTokens: ({accessToken, refreshToken}) => {
        localStorage.setItem(accessTokenKey, accessToken);
        localStorage.setItem(refreshTokenKey, refreshToken);
    },
    getAccessToken: () => localStorage.getItem(accessTokenKey),
    getRefreshToken: () => localStorage.getItem(refreshTokenKey),
    deleteTokens: () => {
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(refreshTokenKey);
    },
    isAuthorized: () => !!localStorage.getItem(accessTokenKey),
    uploadAvatar: (avatar: FormData) => apiService.post(urls.auth.avatar, avatar)
}