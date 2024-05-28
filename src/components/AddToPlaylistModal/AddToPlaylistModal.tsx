import React, {FC, useEffect} from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Modal} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {songsActions} from "../../redux";
import Grid from "@mui/material/Grid";

interface IProps {
    songId: number;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddToPlaylistModal: FC<IProps> = ({songId, open, setOpen}) => {
    const {collections} = useAppSelector(s => s.songsReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!collections.length) dispatch(songsActions.getMyCollections());
    }, [dispatch, collections.length]);

    const onPlaylistChosen = (collectionId: number) => {
        dispatch(songsActions.addToCollection({collectionId, songId}));
    }

    const handleClose = () => setOpen(false);
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description" sx={{zIndex: 100}}>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        background: 'white',
                        borderRadius: 2,
                        height: 350
                    }}>
                    <Box bgcolor={'primary.main'} width={'100%'} height={'5vh'}
                         display={'flex'} justifyContent={'center'} alignItems={'center'}
                         sx={{borderTopLeftRadius: 6, borderTopRightRadius: 6}}>
                        <Typography color={'white'} fontSize={'large'}>Add To Playlist</Typography>
                    </Box>
                    <Grid container sx={{boxSizing: 'border-box', mt: 2}}>
                        {collections.map(c =>
                            <Grid container display={'flex'} className={'pointer blink'} sx={{background: 'white'}}
                                  onClick={() => onPlaylistChosen(c.id)}>
                                <Grid item xs={3}>
                                    <img src={c.imageUrl} alt="logo" width={60} height={60} style={{marginLeft: 5}}/>
                                </Grid>
                                <Grid item xs={9} display={'flex'} flexDirection={'column'}
                                      justifyContent={'space-around'}>
                                    <Typography>{c.title}</Typography>
                                    <Typography>{c.songsCount} songs</Typography>
                                </Grid>
                            </Grid>)}
                    </Grid>
                </Box>
            </Container>
        </Modal>
    );
};