import React, { FC, useEffect, useState } from 'react';
import { ISong, ISongsCollection } from "../../interfaces";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { playerActions, songsActions } from "../../redux";
import { InfoPopupRedux, SongCard } from "../../components";
import Typography from "@mui/material/Typography";
import { v4 as uuid } from "uuid";
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { PlaylistMenu } from "../../components/PlaylistMenu/PlaylistMenu";

export const PlaylistDetailsPage: FC = () => {
    const { id } = useParams();
    const collection: ISongsCollection = useLocation().state;
    const dispatch = useAppDispatch();
    const [currCollectionSongs, setCurrCollectionSongs] = useState<ISong[]>([]);
    const { errors } = useAppSelector(s => s.songsReducer);
    const { isPlaying, trackList } = useAppSelector(s => s.playerReducer);

    useEffect(() => {
        dispatch(songsActions.getCollectionSongs(parseInt(id!))).unwrap()
            .then(data => setCurrCollectionSongs(data.songs))
            .catch(() => {
            });
        return () => {
            dispatch(songsActions.clearSongs());
        }
    }, [id, dispatch]);

    const stateIconClickHandler = () => {
        if (!currCollectionSongs.length) return;
        if (trackList.id !== collection.id) dispatch(songsActions.getSongById(currCollectionSongs[0].id)).unwrap()
            .then(() => {
                dispatch(playerActions.setTrackList({ id: collection.id, songs: currCollectionSongs }));
                dispatch(playerActions.play());
            })
            .catch(() => {
            });
        else if (isPlaying) dispatch(playerActions.pause());
        else dispatch(playerActions.play());
    }

    const StateIcon = isPlaying && !!trackList.songs.length && trackList.id === collection.id ? PauseCircleOutlinedIcon : PlayCircleOutlineOutlinedIcon
    return (
        <Container sx={{ mt: 10 }}>
            <Grid container>
                <Grid size={4}>
                    <img src={collection?.imageUrl} alt={'logo'} width={300} height={300} />
                </Grid>
                <Grid size={1} display={'flex'} alignItems={'flex-end'}>
                    <IconButton onClick={stateIconClickHandler}>
                        <StateIcon fontSize={'large'} sx={{ height: 38, width: 38 }} />
                    </IconButton>
                </Grid>
                <Grid size={7} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
                    <Box display={'flex'} alignItems={'flexEnd'}>
                        <Box>
                            <Typography component="div" variant={'h5'}>
                                <b>{collection.title}</b>
                            </Typography>
                            <Typography>{collection.ownerUserName}</Typography>
                            <Typography>{collection.songsCount} songs</Typography>
                        </Box>
                        <Box>
                            <PlaylistMenu id={collection.id} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Grid container mt={10}>
                {currCollectionSongs.length ?
                    <>
                        {currCollectionSongs.map(s =>
                            <Grid size={6} key={uuid()}
                                onClick={() => dispatch(playerActions.setTrackListSongs(currCollectionSongs))}>
                                <SongCard song={s} />
                            </Grid>
                        )}
                        <Grid size={10} height={100} />
                    </>
                    : <Typography>No songs yet</Typography>}
            </Grid>
            <InfoPopupRedux severity={'error'} content={errors ?? ''} open={!!errors} setOpen={songsActions.setErrors} />
        </Container>
    );
};