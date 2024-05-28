import React, {FC} from 'react';
import {useAppSelector} from "../../hooks";
import ReactPlayer from "react-player";
import {ISongDetails} from "../../interfaces";

interface IProps {
    song: ISongDetails;
    videoPlayerRef: React.MutableRefObject<any>;
}

export const SongMedia: FC<IProps> = ({song, videoPlayerRef}) => {
    const {volume} = useAppSelector(s => s.playerReducer);
    return (
        <>
            <ReactPlayer
                ref={videoPlayerRef}
                width={'100%'}
                height={'80%'}
                url={song?.videoClipUrl || song.songUrl}
                playing={true}
                volume={volume}
                controls={true}
            />
        </>
    );
};