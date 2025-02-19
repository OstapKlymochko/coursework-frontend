import React, { FC, SetStateAction, useState } from 'react';
import Carousel from "react-material-ui-carousel";
import { ISong } from "../../interfaces";
import { SongCard } from "../SongCard/SongCard";
import { v4 as uuid } from "uuid";
import Grid from '@mui/material/Grid2';
import { useAppDispatch } from '../../hooks';
import { playerActions } from '../../redux';

interface IProps {
    songs: ISong[];
    itemsPerPage: number;
}

export const SongsCarousel: FC<IProps> = ({ songs, itemsPerPage }) => {
    const [page, setPage] = useState(0);
    const dispatch = useAppDispatch();

    const totalPages = songs.length % itemsPerPage === 0 ?
        songs.length / itemsPerPage :
        Math.trunc(songs.length / itemsPerPage) + 1;

    const navigate = (direction: string) => {
        let predicate: SetStateAction<number>;
        if (direction === 'next') predicate = (p: number) => {
            if (p === totalPages - 1) return 0;
            return p + 1;
        }
        else if (direction === 'prev') predicate = (p: number) => {
            if (p === 0) return totalPages - 1;
            return p - 1;
        }
        return () => setPage(predicate);
    }

    const setTrackList = () => {
        dispatch(playerActions.setTrackList({ id: -1, songs }));
    }

    return (
        <Carousel autoPlay={false} sx={{ width: '100%', height: 200, pl: 1 }}
            next={navigate('next')}
            prev={navigate('prev')}
            index={page}
            navButtonsAlwaysVisible={true}
            onChange={(p) => setPage(p!)}>

            {Array.from({ length: totalPages }, (v, i) => i).map(() =>
                <Grid container key={uuid()} sx={{ ml: 7 }}>
                    {songs.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage).map(s =>
                        <Grid size={12 / itemsPerPage} key={uuid()} onClick={setTrackList}>
                            <SongCard song={s} />
                        </Grid>
                    )}
                </Grid>
            )}
        </Carousel>
    );
};