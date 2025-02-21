import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
    RegisterPage,
    LoginPage,
    MeInfoPage,
    ResetPasswordPage,
    RequestPasswordResetPage, ConfirmEmailPage, SongsListPage, LibraryPage, PlaylistDetailsPage, SongDetailsPage
} from "./pages";
import { AuthRequireLayout, MainLayout } from "./layouts";
import { useAppDispatch, useAppSelector } from "./hooks";
import { authActions, playerActions, songsActions, commonActions } from "./redux";
import { setupInterceptors } from "./configs";
import { apiService } from "./services";
import { ThemeProvider } from "@mui/material/styles";
import { applyThemeOptions } from './theme';
import { Box, CssBaseline } from '@mui/material';

const SetupInterceptors = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const logout = () => dispatch(authActions.logout());
    const [init, setInit] = useState(false);
    if (!init) {
        setupInterceptors(apiService, navigate, logout);
        setInit(true);
    }
    return <></>
}

export const App = () => {
    const dispatch = useAppDispatch();
    const { genres } = useAppSelector(s => s.songsReducer);
    const { isAuthorized, user } = useAppSelector(s => s.authReducer);
    const { mode } = useAppSelector(s => s.commonReducer);

    useEffect(() => {
        const mode = localStorage.getItem('mode');
        if (!mode || !['light', 'dark'].includes(mode)) return;
        dispatch(commonActions.setMode(mode as ('light' | 'dark')));
    }, []);

    useEffect(() => {
        if (isAuthorized && (!genres.length || !user)) {
            dispatch(authActions.getMyData());
            dispatch(songsActions.getGenres());
        }
    }, [dispatch, isAuthorized]);

    window.onkeydown = ev => {
        if (ev.key === 'MediaPlayPause' && isAuthorized)
            dispatch(playerActions.toggleIsPlaying());
    }
    // const location = useLocation();

    const theme = applyThemeOptions(mode);

    return (
        <Box bgcolor={'primary.main'}>
            <SetupInterceptors />
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <Routes>
                    <Route path={'/'} element={<MainLayout />}>
                        <Route index element={<Navigate to={'/songs'} />} />

                        <Route element={<AuthRequireLayout />}>
                            <Route path={'me'} element={<MeInfoPage />} />
                            <Route path={'songs'} element={<SongsListPage />} />
                            <Route path={'songs/:id'} element={<SongDetailsPage />} />
                            <Route path={'library'} element={<LibraryPage />} />
                            <Route path={'library/:id'} element={<PlaylistDetailsPage />} />
                        </Route>

                        <Route path={'login'} element={<LoginPage />} />
                        <Route path={'register'} element={<RegisterPage />} />
                        <Route path={'forgot-password'} element={<RequestPasswordResetPage />} />
                        <Route path={'reset-password'} element={<ResetPasswordPage />} />
                        <Route path={'confirm-email'} element={<ConfirmEmailPage />} />
                    </Route>
                </Routes>
            </ThemeProvider>
        </Box>
    );
};
