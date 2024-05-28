import React, {useEffect} from 'react';
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {Header, Player, Sidebar} from "../components";
import {useAppDispatch, useAppSelector} from "../hooks";
import {playerActions, songsActions} from "../redux";
import Grid from "@mui/material/Grid";

export const AuthRequireLayout = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {currSong, trackList} = useAppSelector(s => s.playerReducer);
    const dispatch = useAppDispatch();
    const setNextOrPrevSong = (direction: string) => {
        const length = trackList.songs.length;
        if (!currSong || !length) return;
        const diffValue = direction === 'next' ? 1 : -1;
        const currSongIndex = trackList.songs.findIndex(s => s.id === currSong!.id);
        if (currSongIndex === -1) return dispatch(playerActions.pause());
        else if (direction === 'next' && currSongIndex === length - 1) return dispatch(playerActions.pause());
        else if (direction !== 'next' && currSongIndex === 0) return dispatch(playerActions.pause());

        const nextSong = trackList.songs[currSongIndex + diffValue];
        dispatch(songsActions.getSongById(nextSong.id)).unwrap().then(data => {
            dispatch(playerActions.setSong({...nextSong, ...data}));
            if(!id) dispatch(playerActions.play())
        }).catch(() => {
        });
        if(!!id) navigate(`/songs/${nextSong.id}`);
    }
    useEffect(() => {
        return () => {
            dispatch(playerActions.setSong(null))
        }
    }, [dispatch]);
    return (
        <>
            <Header/>
            <Grid container>

                <Grid item xs={1.7}>
                    <Sidebar/>
                </Grid>
                <Grid item xs={10.3}>
                    <Outlet/>
                </Grid>
                {currSong && <Player key={currSong.id} song={currSong} setNextOrPrevSong={setNextOrPrevSong}/>}
            </Grid>
        </>
    );

};