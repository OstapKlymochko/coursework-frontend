import React, {useEffect, useRef} from 'react';
import {animated, useTransition} from "@react-spring/web";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {InfoPopupRedux, SongDetailsTabs, SongMedia} from "../../components";
import {useParams} from "react-router-dom";
import {playerActions, songsActions, statisticsActions} from "../../redux";
import Grid from "@mui/material/Grid";

export const SongDetailsPage = () => {
    const videoRef = useRef(null);
    const {id} = useParams();
    const {songDetails, errors} = useAppSelector(s => s.songsReducer);
    const {currSongId, commentsListStruct} = useAppSelector(s => s.statisticsReducer);
    const dispatch = useAppDispatch()
    const transitions = useTransition([true], {
        from: {transform: 'translate3d(0, 100%, 0)'},
        enter: {transform: 'translate3d(0, 0%, 0)'},
        leave: {transform: 'translate3d(0, 100%, 0)'},
    });

    useEffect(() => {
        dispatch(playerActions.pause());
        if (!id || Number.isNaN(+id)) return;
        const songId = +id;
        if (!currSongId || currSongId !== songId || !commentsListStruct.comments.length) {
            dispatch(statisticsActions.getSongCommentsPaginated({songId, skip: 0, select: 10}));
        }
        if (!songDetails || currSongId !== songDetails?.id) dispatch(songsActions.getSongById(songId));
        dispatch(statisticsActions.setCurrSongId(songId));
        return () => {
            dispatch(playerActions.play());
            dispatch(statisticsActions.clearComments());
        }
    }, [id, dispatch, songDetails?.id]);

    return transitions((style) => (
        <>
            <animated.div style={{...style, width: '100%'}}>
                <Grid container marginTop={5}>
                    <Grid item xs={8} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        {songDetails && <SongMedia song={songDetails} videoPlayerRef={videoRef}/>}
                    </Grid>
                    <Grid item xs={4}>
                        {songDetails && <SongDetailsTabs/>}
                    </Grid>
                </Grid>
                <InfoPopupRedux severity={'error'} content={errors || ''} open={!!errors}
                                setOpen={songsActions.setErrors}/>
            </animated.div>
        </>
    ));
};