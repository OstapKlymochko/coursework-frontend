import React, { useEffect, useState } from 'react';
import { InfoPopupRedux, SongsCarousel, SongsList, UploadSongModal } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ISongsFilterParameters } from "../../interfaces";
import { songsActions } from "../../redux";
import { Box, IconButton, Typography } from '@mui/material';
import AddCircleIcon from "@mui/icons-material/AddCircle";

export const SongsListPage = () => {
    const { songs, searchResult, searchResultPages, errors, songDetails } = useAppSelector(s => s.songsReducer);
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [searchPage, setSearchPage] = useState(1);
    const { user } = useAppSelector(s => s.authReducer);
    const dispatch = useAppDispatch();
    const select = 16;

    useEffect(() => {
        const selectParams = { select, skip: 0 } as ISongsFilterParameters
        dispatch(songsActions.getSongsList(selectParams));
        return () => {
            dispatch(songsActions.clearSongs());
        }
    }, [dispatch]);
     
    return (
        <>
            {!!searchResult.length &&
                <SongsList page={searchPage} pagesCount={searchResultPages} setPage={setSearchPage}
                    songs={searchResult} />}
            {!searchResult.length &&
                <Box display={'flex'} flexDirection={'column'} justifyContent={'space-around'} overflow={'hidden'}>
                    <Box>
                        <Typography component="div" variant={'h5'} ml={12} color={'primary.contrastText'}>Recently listened</Typography>
                        <SongsCarousel songs={songs} itemsPerPage={3} />
                    </Box>
                    <Box>
                        <Typography component="div" variant={'h5'} ml={12} color={'primary.contrastText'}>Reccomendations</Typography>
                        <SongsCarousel songs={songs} itemsPerPage={3} />
                    </Box>
                    {user && user.roles?.includes('Author') &&
                        <IconButton onClick={() => setOpenUploadModal(true)}
                            sx={{
                                position: 'fixed',
                                bottom: songDetails ? '10%' : '5%',
                                right: '5%'
                            }}>
                            <AddCircleIcon sx={{ fontSize: '3rem' }} color={'secondary'} />
                        </IconButton>}
                    <UploadSongModal open={openUploadModal} setOpen={setOpenUploadModal} />
                </Box>}
            <InfoPopupRedux severity={'error'} content={errors ?? ''} open={!!errors} setOpen={songsActions.setErrors} />
        </>
    );
};