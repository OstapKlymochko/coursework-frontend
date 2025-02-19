import React, { FC, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from "../../hooks";
import ReactPlayer from "react-player";
import { ISongDetails } from "../../interfaces";
import { songsActions as playerActions } from '../../redux';

interface IProps {
    song: ISongDetails;
}

export const SongMedia: FC<IProps> = ({ song }) => {
    const videoPlayerRef = useRef<ReactPlayer>(null);
    const dispatch = useAppDispatch();
    const { isPlaying, currListenTime } = useAppSelector(s => s.playerReducer);

    useEffect(() => {
        if (song.videoClipUrl) {
            dispatch(playerActions.setSong({ ...song, songUrl: song.videoClipUrl }));
        }
    }, [song.id]);

    useEffect(() => {
        if (!videoPlayerRef.current) return;

        const player = videoPlayerRef.current.getInternalPlayer();
        if (!player) return;

        player.currentTime = currListenTime;

    }, [currListenTime]);

    return (
        <ReactPlayer
            ref={videoPlayerRef}
            width={'100%'}
            height={'80%'}
            url={song.videoClipUrl ?? song.songUrl}
            playing={isPlaying}
            muted={true}
        />

    );
};