import React, { FC, useState } from 'react';
import { useAppSelector } from "../../hooks";
import { IconButton, Box, Card, CardContent, CardMedia, Typography, CircularProgress } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import { PlayArrow } from "@mui/icons-material";
import { ISong } from "../../interfaces";
import { useNavigate } from "react-router-dom";

interface IProps {
    song: ISong;
}

export const SmallSongCard: FC<IProps> = ({ song }) => {
    const { isPlaying } = useAppSelector(s => s.playerReducer);
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
    const { loading, songDetails } = useAppSelector(s => s.songsReducer);
    const navigate = useNavigate();

    const StateIcon = isPlaying && !!songDetails && song.id === songDetails.id ? PauseIcon : PlayArrow;
    
    return (
        <Box onMouseOver={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)} style={{ marginTop: 5 }}>
            <Card sx={{ display: 'flex' }}>
                <Box sx={{ position: 'relative' }} >
                    {isMouseOver &&
                        <IconButton aria-label="play/pause" sx={{
                            position: 'absolute', top: '50%',
                            left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1
                        }} onClick={() => navigate(`/songs/${song.id}`)}>
                            <StateIcon sx={{ height: 20, width: 20, color: 'white' }} component={'svg'} />
                        </IconButton>}
                    {isMouseOver && loading &&
                        <IconButton aria-label="play/pause" sx={{
                            position: 'absolute', top: '50%',
                            left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1
                        }}>
                            <CircularProgress />
                        </IconButton>}
                    <CardMedia
                        component="img"
                        sx={{
                            boxSizing: 'border-box', filter: isMouseOver ? 'brightness(50%)' : '',
                            overflow: 'hidden', width: 60
                            // objectFit: 'contain'
                        }}
                        image={song?.logoUrl}
                        height={60}
                        alt="Song logo"
                        loading={'lazy'} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                    <CardContent sx={{ flex: '1 0 auto', p: 0, '&:last-child': { pb: 0 } }}>
                        <Typography component="div" variant="h5">
                            {song?.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {song?.authorPseudonym}
                        </Typography>
                    </CardContent>
                </Box>
            </Card>
        </Box>
    );
};