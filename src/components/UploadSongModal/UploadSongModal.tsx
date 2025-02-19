import React, {FC, useState} from 'react';
import {CircularProgress, Modal, useTheme} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { ThemedTextField } from "../ThemedTextField/ThemedTextField";
import {Dropdown} from "../Dropdown/Dropdown";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {IUploadSong} from "../../interfaces";
import {songsActions} from "../../redux";
import {MuiFileInput} from "mui-file-input";
import Typography from "@mui/material/Typography";
import {AttachFile} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {InfoPopupRedux} from "../InfoPopupRedux/InfoPopupRedux";

interface IProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const UploadSongModal: FC<IProps> = ({setOpen, open}) => {
    const [uploadSongData, setUploadSongData] = useState<IUploadSong>({
        song: null, title: null, logo: null, genreId: null, videoClip: null
    });
    const {genres, responseMessage, loading} = useAppSelector(s => s.songsReducer);
    const dispatch = useAppDispatch();
    const {uploadSong, setErrors, setResponseMessage} = songsActions;
    const {user} = useAppSelector(s => s.authReducer);
    const uploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!user) dispatch(setErrors("User must be logged in"));
        if (!uploadSongData.genreId || !uploadSongData.title) return dispatch(setErrors('Genre and title must be specified'));
        const formData = new FormData();
        formData.append('pseudonym', user?.userName!)
        formData.append('title', uploadSongData.title)
        formData.append('genreId', uploadSongData.genreId.toString());
        if (!uploadSongData.song) return dispatch(setErrors("Song must be selected"))
        formData.append('song', uploadSongData.song);
        if (uploadSongData.logo) formData.append('logo', uploadSongData.logo);
        if (uploadSongData.videoClip) formData.append('videoClip', uploadSongData.videoClip);
        dispatch(uploadSong(formData)).unwrap().then(() => {
            setUploadSongData({song: null, title: null, logo: null, genreId: null, videoClip: null});
        }).catch(() => {
        });
    }
    const handleClose = () => setOpen(false);
    
    const theme = useTheme();

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description" sx={{zIndex: 100}}>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: theme.palette.secondary.main,
                        borderRadius: 2
                    }}>
                    <Box bgcolor={'secondary.main'} width={'100%'} height={'5vh'}
                         display={'flex'} justifyContent={'center'} alignItems={'center'}
                         sx={{borderTopLeftRadius: 6, borderTopRightRadius: 6}}>
                        <Typography color={'white'} fontSize={'large'}>Upload Song</Typography>
                    </Box>
                    <Box component="form" noValidate onSubmit={uploadSubmit}
                         sx={{mt: 3, padding: '0 10px 0',}}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <ThemedTextField
                                    required
                                    fullWidth
                                    label="Song title"
                                    autoComplete="title"
                                    value={uploadSongData.title || ''}
                                    onChange={(e) => setUploadSongData(p => ({...p, title: e.target.value}))}
                                />
                            </Grid>
                            <Grid size={12}>
                                <MuiFileInput
                                    label={'Song'}
                                    placeholder={'Choose file'}
                                    value={uploadSongData.song}
                                    onChange={(file) => setUploadSongData(p => ({...p, song: file}))}
                                    required
                                    clearIconButtonProps={{
                                        children: <CloseIcon fontSize={'small'}/>
                                    }}
                                    InputProps={{
                                        startAdornment: <AttachFile/>
                                    }}/>
                            </Grid>
                            <Grid size={12}>
                                <MuiFileInput
                                    label={'Logo'}
                                    placeholder={'Choose file'}
                                    value={uploadSongData.logo}
                                    onChange={(file) => setUploadSongData(p => ({...p, logo: file}))}
                                    clearIconButtonProps={{
                                        children: <CloseIcon fontSize={'small'}/>
                                    }}
                                    InputProps={{
                                        startAdornment: <AttachFile/>
                                    }}/>
                            </Grid>
                            <Grid size={12}>
                                <MuiFileInput
                                    label={'Video clip'}
                                    placeholder={'Choose file'}
                                    value={uploadSongData.videoClip}
                                    onChange={(file) => setUploadSongData(p => ({...p, videoClip: file}))}
                                    clearIconButtonProps={{
                                        children: <CloseIcon fontSize={'small'}/>
                                    }}
                                    InputProps={{
                                        startAdornment: <AttachFile/>
                                    }}/>
                            </Grid>
                            <Grid size={6}>
                                <Dropdown title={"Genre"}
                                          menuItems={genres.map(i => ({
                                              label: i.title,
                                              value: i.id.toString()
                                          }))}
                                          setSelectedItem={(id) => setUploadSongData(p => ({...p, genreId: +id!}))}
                                          selectedItem={uploadSongData.genreId?.toString() || ''}/>
                            </Grid>
                            <Grid size={6} display={'flex'} justifyContent={'flex-end'}>
                                {loading && <CircularProgress sx={{ml: 5, mt: 5}}/>}
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}>
                            Upload
                        </Button>
                    </Box>
                </Box>
                {responseMessage &&
                    <InfoPopupRedux severity={'success'} content={responseMessage} open={!!responseMessage}
                                    setOpen={setResponseMessage}/>}
            </Container>
        </Modal>
    );
};