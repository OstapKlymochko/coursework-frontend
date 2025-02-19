import React, { FC, useEffect } from 'react';
import Container from "@mui/material/Container";
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { v4 as uuid } from "uuid";
import { useAppDispatch } from "../../hooks";
import { songsActions, playerActions } from "../../redux";
import { ISongsFilterParameters, ISong } from "../../interfaces";
import { SongCard } from "../SongCard/SongCard";

interface IProps {
    songs: ISong[];
    setPage: React.Dispatch<React.SetStateAction<number>>;
    page: number;
    pagesCount: number;
}

export const SongsList: FC<IProps> = ({ songs, setPage, page, pagesCount }) => {
    const select = 10;
    const dispatch = useAppDispatch();
    const { getSongsList } = songsActions;

    const setTrackList = () => {
        dispatch(playerActions.setTrackList({ id: -1, songs }));
    }

    useEffect(() => {
        const selectParams = { select, skip: page * select - select } as ISongsFilterParameters
        dispatch(getSongsList(selectParams));
    }, [page, select, dispatch, getSongsList]);

    return (
        <div style={{ position: 'relative' }}>
            <Container maxWidth={"lg"} sx={{ padding: '32px 8px 0' }}>
                <Grid container>
                    {songs.map((s, i) =>
                        <Grid size={6} key={uuid()} onClick={setTrackList}>
                            <SongCard song={s} />
                        </Grid>
                    )}
                </Grid>
                {!!pagesCount && pagesCount > 1 && <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    marginBottom={10}>
                    <Button disabled={page <= 1} onClick={() => setPage(prev => --prev)}>prev</Button>
                    <Button disabled={page >= pagesCount} onClick={() => setPage(prev => ++prev)}>next</Button>
                </Box>}
            </Container>
        </div>
    )
}

