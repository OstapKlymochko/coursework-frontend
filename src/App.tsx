import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {
    RegisterPage,
    LoginPage,
    MeInfoPage,
    ResetPasswordPage,
    RequestPasswordResetPage, ConfirmEmailPage, SongsListPage, LibraryPage, PlaylistDetailsPage, SongDetailsPage
} from "./pages";
import {AuthRequireLayout, MainLayout} from "./layouts";
import {useAppDispatch, useAppSelector} from "./hooks";
import {authActions, playerActions, songsActions} from "./redux";
import {setupInterceptors} from "./configs";
import {apiService} from "./services";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {animated, useTransition} from '@react-spring/web';

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
    const {isAuthorized, genres, user} = useAppSelector(s => ({...s.authReducer, ...s.songsReducer}));
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
    const location = useLocation();

    // const transition = useTransition(location, {
    //     from: {transform: "translateY(100%)"},
    //     enter: {transform: "translateY(0)"},
    //     leave: {transform: "translateY(100%)"}
    // });

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        <>
            <SetupInterceptors/>
            {/*<ThemeProvider theme={darkTheme}>*/}
            <Routes>
                <Route path={'/'} element={<MainLayout/>}>
                    <Route index element={<Navigate to={'/songs'}/>}/>

                    <Route element={<AuthRequireLayout/>}>
                        <Route path={'me'} element={<MeInfoPage/>}/>
                        <Route path={'songs'} element={<SongsListPage/>}/>
                        <Route path={'songs/:id'} element={<SongDetailsPage/>}/>
                        <Route path={'library'} element={<LibraryPage/>}/>
                        <Route path={'library/:id'} element={<PlaylistDetailsPage/>}/>
                    </Route>

                    <Route path={'login'} element={<LoginPage/>}/>
                    <Route path={'register'} element={<RegisterPage/>}/>
                    <Route path={'forgot-password'} element={<RequestPasswordResetPage/>}/>
                    <Route path={'reset-password'} element={<ResetPasswordPage/>}/>
                    <Route path={'confirm-email'} element={<ConfirmEmailPage/>}/>
                </Route>
            </Routes>
            {/*</ThemeProvider>*/}
        </>
    );
};
