import React, { FC, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from "../../hooks";
import ReactPlayer from "react-player";
import { ISongDetails } from "../../interfaces";
import { songsActions, playerActions } from '../../redux';
import Box from '@mui/material/Box';

interface IProps {
    song: ISongDetails;
}

export const SongMedia: FC<IProps> = ({ song }) => {
    const videoPlayerRef = useRef<ReactPlayer>(null);
    const dispatch = useAppDispatch();
    const { isPlaying, currListenTime } = useAppSelector(s => s.playerReducer);

    useEffect(() => {
        if (song.videoClipUrl) {
            dispatch(songsActions.setSong({ ...song, songUrl: song.videoClipUrl }));
        }
    }, [song.id]);

    useEffect(() => {
        if (!videoPlayerRef.current) return;

        const player = videoPlayerRef.current.getInternalPlayer();
        if (!player) return;

        player.currentTime = currListenTime;

    }, [currListenTime]);

    return (
        <Box width={'90%'} height={'90%'} onClick={() => dispatch(playerActions.toggleIsPlaying())}>
            {song.videoClipUrl ?
                <ReactPlayer
                    ref={videoPlayerRef}
                    width={'100%'}
                    height={'100%'}
                    url={song.videoClipUrl ?? song.songUrl}
                    playing={isPlaying}
                    muted={true}
                /> :
                <Box sx={{
                    backgroundImage: `url(${song.logoUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }} width={'100%'}
                    height={'100%'}>
                </Box>
            }
        </Box>
    );
};