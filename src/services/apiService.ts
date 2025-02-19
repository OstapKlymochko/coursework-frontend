import axios, {AxiosInstance, AxiosResponse} from "axios";

import {baseURL} from "../configs";

export type IRes<T> = Promise<AxiosResponse<T>>;
export const apiService: AxiosInstance = axios.create({baseURL});
// const history = createBrowserHistory({window});
// apiService.interceptors.request.use((config) => {
//     if (authService.isAuthorized()) {
//         const token = config.url!.includes('refresh') ? authService.getRefreshToken() : authService.getAccessToken();
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// })
//
// let isRefreshing = false;
// apiService.interceptors.response.use((config) => {
//     return config;
// }, async (error) => {
//     const refresh = authService.getRefreshToken();
//
//     if (error.response?.status === 401 && !isRefreshing && refresh) {
//         isRefreshing = true;
//         try {
//             await authService.refresh();
//         } catch (e) {
//             authService.deleteTokens();
//         }
//         isRefreshing = false;
//         return apiService(error.config);
//     }
//     return Promise.reject(error);
// })