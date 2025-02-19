import React, { FC, useEffect } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Modal, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { songsActions } from "../../redux";
import Grid from "@mui/material/Grid2";
import { v4 as uuid } from 'uuid';

interface IProps {
    songId: number;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddToPlaylistModal: FC<IProps> = ({ songId, open, setOpen }) => {
    const { collections } = useAppSelector(s => s.songsReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!collections.length) dispatch(songsActions.getMyCollections());
    }, [dispatch, collections.length]);

    const onPlaylistChosen = (collectionId: number) => {
        dispatch(songsActions.addToCollection({ collectionId, songId }));
    }

    const handleClose = () => setOpen(false);

    const theme = useTheme();

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description" sx={{ zIndex: 100, top: '10%' }}>
            <Box component="main" maxWidth="xs" sx={{ background: theme.palette.secondary.main, width: '20%', justifySelf: 'center' }}>
                <Box
                    sx={{
                        // marginTop: 8,
                        // background: 'white',
                        borderRadius: 2,
                        height: 350
                    }}>
                    <Box width={'100%'} height={'5vh'} bgcolor={'primary.main'}
                        display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <Typography fontSize={'large'}>Add To Playlist</Typography>
                    </Box>
                    <Grid container sx={{ boxSizing: 'border-box', mt: 2, flexDirection: 'column' }}>
                        {collections.map(c =>
                            <Grid key={uuid()} container display={'flex'} className={'pointer blink'} width={'100%'}
                                // sx={{background: 'white'}}
                                onClick={() => onPlaylistChosen(c.id)} margin={'10px 0'}>
                                <Grid size={3}>
                                    <img src={c.imageUrl} alt="logo" width={60} height={60} style={{ marginLeft: 5 }} />
                                </Grid>
                                <Grid size={9} display={'flex'} flexDirection={'column'}
                                    justifyContent={'space-around'}>
                                    <Typography>{c.title}</Typography>
                                    <Typography>{c.songsCount} songs</Typography>
                                </Grid>
                            </Grid>)}
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
};