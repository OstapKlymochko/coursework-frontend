import React, { FC, useState } from 'react';
import { Box, Card, CardContent, CardMedia, CircularProgress, IconButton, Typography } from '@mui/material';
import Container from "@mui/material/Container";
import { PlayArrow } from "@mui/icons-material";
import PauseIcon from '@mui/icons-material/Pause';

import { ISong } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { songsActions, playerActions } from "../../redux";

interface IProps {
    song: ISong;
}

export const SongCard: FC<IProps> = ({ song }) => {
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
    const { loading, songDetails } = useAppSelector(s => s.songsReducer);
    const { isPlaying } = useAppSelector(s => s.playerReducer);
    const dispatch = useAppDispatch();

    const getSongDetails = () => {
        if (!songDetails || songDetails.id !== song.id) dispatch(songsActions.getSongById(song.id))
        else if (isPlaying && songDetails.id === song.id) {
            dispatch(playerActions.pause())
        } else if (!isPlaying && songDetails.id === song.id) {
            dispatch(playerActions.play());
        }
    }

    const StateIcon = isPlaying && !!songDetails && songDetails.id === song.id ? PauseIcon : PlayArrow
    return (
        <Box onMouseOver={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)}
            style={{ display: 'inline-block', width: '70%' }}>
            <Container maxWidth={'xs'} sx={{ m: 1, height: 50 }}>
                <Card sx={{ display: 'flex', maxWidth: 400 }}>
                    <Box sx={{ width: 170 }}>
                        <Box sx={{ position: 'relative' }}>
                            {isMouseOver &&
                                <IconButton aria-label="play/pause" sx={{
                                    position: 'absolute', top: '50%',
                                    left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1
                                }} onClick={getSongDetails}>
                                    <StateIcon sx={{ height: 38, width: 38, color: 'white' }} component={'svg'} />
                                </IconButton>}
                            {isMouseOver && loading &&
                                <IconButton aria-label="play/pause" sx={{
                                    position: 'absolute', top: '50%',
                                    left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1
                                }}>
                                    <CircularProgress />
                                </IconButton>}
                            {/*<CardMedia*/}
                            {/*    component="img"*/}
                            {/*    sx={{*/}
                            {/*        maxWidth: 151,*/}
                            {/*        boxSizing: 'border-box', filter: isMouseOver ? 'brightness(50%)' : '',*/}
                            {/*        objectFit: 'contain'*/}
                            {/*    }}*/}
                            {/*    image={song.logoUrl}*/}
                            {/*    height={150}*/}
                            {/*    alt="Song logo"*/}
                            {/*    loading={'lazy'}/>*/}
                            <div style={{
                                backgroundImage: `url(${song.logoUrl})`,
                                width: 150,
                                height: 150,
                                backgroundSize: '100% 100%',
                                filter: isMouseOver ? 'brightness(50%)' : ''
                            }}></div>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                {song.title}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {(song.authorPseudonym || '') + ' ' + song.genre}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
};