import {NavigateFunction} from "react-router-dom";
import {AxiosInstance} from "axios";
import {authService} from "../services";

export const setupInterceptors = (axiosInstance: AxiosInstance, navigate: NavigateFunction, logout: () => void) => {
    axiosInstance.interceptors.request.use((config) => {
        if (authService.isAuthorized()) {
            const token = config.url!.includes('refresh') ? authService.getRefreshToken() : authService.getAccessToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    let isRefreshing = false;
    axiosInstance.interceptors.response.use((config) => {
        return config;
    }, async (error) => {
        const refresh = authService.getRefreshToken();
        if (error.code === 'ERR_NETWORK' || !refresh) {
            logout();
            navigate('/login');
        }
        
        if (error.response?.status === 401 && !isRefreshing && !!refresh) {
            isRefreshing = true;
            try {
                await authService.refresh();
            } catch (e) {
                logout();
                navigate('/login', {state: {sessionExpired: true}});
            }
            isRefreshing = false;
            return axiosInstance(error.config);
        }
        return Promise.reject(error);
    })
}