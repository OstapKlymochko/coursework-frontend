import React, { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Header, InfoPopupRedux, Player, Sidebar } from "../components";
import { useAppDispatch, useAppSelector } from "../hooks";
import { playerActions, songsActions } from "../redux";
import Grid from "@mui/material/Grid2";
import Box from '@mui/material/Box';

export const AuthRequireLayout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { trackList } = useAppSelector(s => s.playerReducer);
    const { songDetails, errors, responseMessage } = useAppSelector(s => s.songsReducer);
    const dispatch = useAppDispatch();

    const setNextOrPrevSong = (direction: string) => {
        const length = trackList.songs.length;
        if (!songDetails || !length) return;

        const diffValue = direction === 'next' ? 1 : -1;
        const currSongIndex = trackList.songs.findIndex(s => s.id === songDetails.id);
        if (
            currSongIndex === -1 ||
            direction === 'next' && currSongIndex === length - 1 ||
            direction !== 'next' && currSongIndex === 0
        ) return dispatch(playerActions.pause());

        const nextSong = trackList.songs[currSongIndex + diffValue];

        dispatch(songsActions.getSongById(nextSong.id)).unwrap();

        if (id) navigate(`/songs/${nextSong.id}`);
    }

    useEffect(() => {
        return () => {
            dispatch(songsActions.clearSongs());
            dispatch(songsActions.clearSongDetails());
        }
    }, []);

    return (
        <Box>
            <Header />
            <Grid container>
                <Grid size={1.7}>
                    <Sidebar />
                </Grid>
                <Grid size={10.3}>
                    <Outlet />
                </Grid>
                {songDetails && <Player setNextOrPrevSong={setNextOrPrevSong} />}
            </Grid>
            <InfoPopupRedux severity={'error'} content={errors ?? ''} open={!!errors} setOpen={songsActions.setErrors} />
            <InfoPopupRedux severity={'success'} content={responseMessage ?? ''} open={!!responseMessage}
                setOpen={songsActions.setResponseMessage} />
        </Box>
    );

};