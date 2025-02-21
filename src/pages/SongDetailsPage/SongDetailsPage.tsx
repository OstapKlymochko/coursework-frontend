import React, { useEffect } from 'react';
import { animated, useTransition } from "@react-spring/web";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { InfoPopupRedux, SongDetailsTabs, SongMedia } from "../../components";
import { useParams } from "react-router-dom";
import { songsActions, statisticsActions } from "../../redux";
import Grid from "@mui/material/Grid2";

export const SongDetailsPage = () => {
    const { id } = useParams();
    const songDetails = useAppSelector(s => s.songsReducer.songDetails);
    const errors = useAppSelector(s => s.songsReducer.errors);
    const { currSongId, commentsListStruct } = useAppSelector(s => s.statisticsReducer);

    const dispatch = useAppDispatch()
    const transitions = useTransition([true], {
        from: { transform: 'translate3d(0, 100%, 0)' },
        enter: { transform: 'translate3d(0, 0%, 0)' },
        leave: { transform: 'translate3d(0, 100%, 0)' },
    });

    useEffect(() => {        
        if (!id || Number.isNaN(+id)) return;
        const songId = +id;
        if (!currSongId || currSongId !== songId || !commentsListStruct.comments.length) {
            dispatch(statisticsActions.getSongCommentsPaginated({ songId, skip: 0, select: 10 }));
        }
        if (!songDetails) dispatch(songsActions.getSongById(songId));
        dispatch(statisticsActions.setCurrSongId(songId));

        return () => {
            dispatch(statisticsActions.clearComments());
        }
    }, [id, dispatch]);

    return transitions((style) => (
        <animated.div style={{ ...style, width: '100%' }}>
            <Grid container marginTop={5}>
                <Grid size={8} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    {songDetails && <SongMedia song={songDetails} />}
                </Grid>
                <Grid size={4}>
                    {songDetails && <SongDetailsTabs />}
                </Grid>
            </Grid>
            <InfoPopupRedux severity={'error'} content={errors ?? ''} open={!!errors}
                setOpen={songsActions.setErrors} />
        </animated.div>
    ));
};

