import React, {FC, useEffect, useRef, useState} from 'react';
import {ISongDetails} from "../../interfaces";
import Grid from "@mui/material/Grid";
import {CardMedia, IconButton, Slider, Stack} from "@mui/material";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import {useAppDispatch, useAppSelector} from "../../hooks";
import PauseIcon from "@mui/icons-material/Pause";
import {PlayArrow} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {playerActions, songsActions, statisticsActions} from "../../redux";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import {AddToPlaylistModal} from "../AddToPlaylistModal/AddToPlaylistModal";
import {NavLink, useNavigate} from "react-router-dom";
import {InfoPopupRedux} from "../InfoPopupRedux/InfoPopupRedux";

interface IProps {
    song: ISongDetails,
    setNextOrPrevSong: (direction: string) => void
}

const formatStatisticData = (song: ISongDetails) => {
    const res = {likes: song.likes.toString(), dislikes: song.dislikes.toString(), comments: song.comments.toString()};
    if (song.likes >= 1000) res.likes = (song.likes / 1000).toFixed(1) + 'k';
    if (song.dislikes >= 1000) res.dislikes = (song.likes / 1000).toFixed(1) + 'k';
    if (song.comments >= 1000) res.comments = (song.likes / 1000).toFixed(1) + 'k';
    return res;
}

export const Player: FC<IProps> = ({song, setNextOrPrevSong}) => {
    const {errors, responseMessage, songDetails} = useAppSelector(s => s.songsReducer);
    const {isPlaying, volume} = useAppSelector(s => s.playerReducer);
    const [duration, setDuration] = useState(0);
    const [currTime, setCurrTime] = useState(0);
    const [listenedSeconds, setListenedSeconds] = useState(0);
    const [openSaveModal, setOpenSaveModal] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const playerRef = useRef<HTMLAudioElement>(null);
    const intervalRef = useRef<NodeJS.Timer>();
    const formatTime = (seconds: number) => {
        if (seconds === 0) {
            return '00:00';
        }
        const rounded = Math.round(seconds);
        const minutes = Math.floor(rounded / 60);
        const secondsLeft = rounded % 60;
        return `${minutes}:${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}`;
    }

    const handleNavigate = (direction: string) => {
        setNextOrPrevSong(direction);
        checkListenTime();
    }

    const checkListenTime = () => {
        if (listenedSeconds >= duration * 0.7) dispatch(songsActions.registerListening(song.id));
    }

    const onEnded = () => {
        setCurrTime(0);
        handleNavigate('next');
        clearInterval(intervalRef.current);
    }

    const handleReaction = (reaction: string) => {
        if ((reaction === 'like' && song.isLiked) || (reaction === 'dislike' && song.isDisliked)) dispatch(statisticsActions.deleteReaction(song.id));
        else dispatch(statisticsActions.postReaction({type: reaction, songId: song.id}));
    }

    const handleTimeChange = (value: number) => {
        if (value < 0 || value > duration) return;
        setCurrTime(value);
        playerRef.current!.currentTime = value;
    }

    useEffect(() => {
        if (isPlaying) {
            const playPromise = playerRef.current!.play();
            if (!playPromise) return;
            playPromise.then(() => {
                intervalRef.current = setInterval(() => {
                    setCurrTime(playerRef.current?.currentTime || 0);
                    setListenedSeconds(p => ++p);
                }, 1000);
            }).catch(() => {
            });
        } else {
            playerRef.current!.pause();
            clearInterval(intervalRef.current);
        }
        return () => {
            clearInterval(intervalRef.current);
        }
    }, [isPlaying, song.id]);

    useEffect(() => {
        if (playerRef.current)
            playerRef.current.volume = volume;
    }, [volume]);

    const handleLoadDetails = () => {
        if (!songDetails || songDetails.id !== song.id) navigate(`/songs/${song.id}`);
    }

    const StateIcon = isPlaying ? PauseIcon : PlayArrow;
    const VolumeIcon = volume === 0 ? VolumeOffIcon : VolumeUpIcon;
    const LikeIcon = song.isLiked ? ThumbUpRoundedIcon : ThumbUpOffAltIcon;
    const DislikeIcon = song.isDisliked ? ThumbDownRoundedIcon : ThumbDownOffAltIcon;
    const action = isPlaying ? playerActions.pause : playerActions.play;
    const statistics = formatStatisticData(song);

    return (
        <Container sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            background: 'white',
            zIndex: 100
        }} maxWidth={false}>
            <Slider value={currTime} max={duration} onChange={(_, value) => handleTimeChange(value as number)}/>
            <Grid container>
                <audio ref={playerRef} src={song.songUrl} preload={'metadata'} autoPlay={true}
                       onLoadedMetadata={() => setDuration(playerRef.current!.duration)}
                       onEnded={onEnded}
                       onPlay={() => dispatch(playerActions.play())}
                       onPause={() => dispatch(playerActions.pause())}>
                </audio>
                <Grid item xs={2} display={'flex'} alignItems={'center'}>
                    <IconButton onClick={() => handleNavigate('prev')}><SkipPreviousIcon
                        fontSize={'large'}/></IconButton>
                    <IconButton onClick={() => dispatch(action())}><StateIcon fontSize={'large'}/></IconButton>
                    <IconButton onClick={() => handleNavigate('next')}><SkipNextIcon
                        fontSize={'large'}/></IconButton>
                    <Typography>{formatTime(currTime)} / {formatTime(duration)}</Typography>
                </Grid>
                <Grid item xs={9} display={'flex'} alignItems={'flex-start'} justifyContent={'center'}>
                    <CardMedia
                        component={'img'}
                        image={song.logoUrl}
                        sx={{
                            width: 50,
                            height: 50,
                            mr: '20px'
                        }}/>
                    <Box>
                        <Typography align={'center'} fontSize={'1.5rem'}
                                    onClick={handleLoadDetails}
                                    className={'pointer'}>{song.title}</Typography>
                        <Typography align={'center'}
                                    fontSize={'1rem'}>{song.authorPseudonym || ''}</Typography>
                    </Box>
                    <IconButton sx={{ml: 5}} onClick={() => setOpenSaveModal(true)}>
                        <PlaylistAddRoundedIcon fontSize={'medium'}/>
                    </IconButton>
                    <IconButton onClick={() => handleReaction('like')}>
                        <LikeIcon fontSize={'medium'}/>
                        <Typography sx={{ml: 1}}>{statistics.likes}</Typography>
                    </IconButton>
                    <IconButton onClick={() => handleReaction('dislike')}>
                        <DislikeIcon fontSize={'medium'}/>
                        <Typography sx={{ml: 1}}>{statistics.dislikes}</Typography>
                    </IconButton>
                    <IconButton>
                        <CommentRoundedIcon fontSize={'medium'}/>
                        <Typography sx={{ml: 1}}>{statistics.comments}</Typography>
                    </IconButton>
                    <Stack spacing={1} direction="row" sx={{mb: 1, px: 1, width: 150}} alignItems="center"
                           justifyContent={'flex-end'}>
                        <IconButton onClick={() => dispatch(playerActions.setVolume(0))}> <VolumeIcon/> </IconButton>
                        <Slider size={'medium'} value={volume} max={1} step={0.05} sx={{width: '100%'}}
                                onChange={(_, value) => dispatch(playerActions.setVolume(value as number))}/>
                    </Stack>
                </Grid>
            </Grid>
            <AddToPlaylistModal songId={song.id} open={openSaveModal} setOpen={setOpenSaveModal}/>
            <InfoPopupRedux severity={'error'} content={errors || ''} open={!!errors} setOpen={songsActions.setErrors}/>
            <InfoPopupRedux severity={'success'} content={responseMessage || ''} open={!!responseMessage}
                            setOpen={songsActions.setResponseMessage}/>
        </Container>
    );
};