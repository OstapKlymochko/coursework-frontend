import React, {FC, useState} from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Dropdown} from "../Dropdown/Dropdown";
import {CircularProgress, Modal} from "@mui/material";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {songsActions} from "../../redux";
import {ICreateSongCollection} from "../../interfaces";

interface IProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const CreateCollectionModal: FC<IProps> = ({setOpen, open}) => {
    const {loading} = useAppSelector(s => s.songsReducer);
    const {user} = useAppSelector(s => s.authReducer);
    const [createCollectionData, setCreateCollectionData] = useState<ICreateSongCollection>({
        title: '',
        type: 'Playlist',
        ownerUserName: user?.userName || ''
    });
    const dispatch = useAppDispatch();

    const getAllowedTypes = () => {
        const values = [
            {label: 'Playlist', value: 'Playlist'}
        ]
        if (user?.roles?.includes('Author')) values.push({
            label: 'Album', value: 'Album'
        });
        return values;
    }
    const uploadSubmit = (e: React.FormEvent) => {
        if(!createCollectionData.ownerUserName) return dispatch(songsActions.setErrors('Unspecified username'));
        e.preventDefault();
        dispatch(songsActions.createCollection(createCollectionData));
    }
    const handleClose = () => setOpen(false);

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
                        background: 'white',
                        borderRadius: 2,
                    }}>
                    <Box bgcolor={'primary.main'} width={'100%'} height={'5vh'}
                         display={'flex'} justifyContent={'center'} alignItems={'center'}
                         sx={{borderTopLeftRadius: 6, borderTopRightRadius: 6}}>
                        <Typography color={'white'} fontSize={'large'}>Create collection</Typography>
                    </Box>
                    <Box component="form" noValidate onSubmit={uploadSubmit}
                         sx={{mt: 3, padding: '0 10px 0',}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Collection title"
                                    autoComplete="title"
                                    value={createCollectionData.title || ''}
                                    onChange={(e) =>
                                        setCreateCollectionData(p => ({...p, title: e.target.value}))}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <Dropdown title={"Type"}

                                          menuItems={getAllowedTypes()}
                                          setSelectedItem={(t) =>
                                              setCreateCollectionData(p => ({...p, type: `${t}`}))}
                                          selectedItem={createCollectionData.type}/>
                            </Grid>
                            <Grid item xs={6} display={'flex'} justifyContent={'flex-end'}>
                                {loading && <CircularProgress sx={{ml: 5, mt: 5}}/>}
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}>
                            Create
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Modal>
    );
};