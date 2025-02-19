import React, { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { InfoAlert } from "../InfoAlert/InfoAlert";
import { IUserData } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { authActions } from "../../redux";
import { InfoPopupRedux } from "../InfoPopupRedux/InfoPopupRedux";

export const Profile: FC = () => {
    const { errors, user, responseMessage } = useAppSelector(s => s.authReducer);
    const { updateUser, getMyData, setResponseMessage } = authActions;
    const dispatch = useAppDispatch();
    const [updateData, setUpdateData] = useState<IUserData>(user!);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [currFile, setCurrFile] = useState<string | null>(user?.avatarUrl || null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!user) {
            dispatch(getMyData()).unwrap().then(u => setUpdateData(u)).catch(() => {
            });
        }
    }, [dispatch, updateData, getMyData, user])


    console.log(user);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setUpdateData(data => {
        if (data) {
            return { ...updateData, [e.target.name]: e.target.value }
        }
        return data;
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(updateUser(updateData!));
        if (!!avatar) {
            const formData = new FormData();
            formData.append('userId', user!.id.toString());
            formData.append('avatar', avatar);
            dispatch(authActions.uploadAvatar(formData)).unwrap().then(() => {
                setAvatar(null);
            }).catch(() => {
            })
        }
    }

    const selectFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAvatar(e.target.files[0]);
            setCurrFile(URL.createObjectURL(e.target.files[0]));
        }
    }

    useEffect(() => {
        if (!!user?.avatarUrl && !avatar) setCurrFile(user?.avatarUrl);
    }, [user?.avatarUrl, avatar])

    return (
        <Container maxWidth={"lg"} sx={{ padding: '32px 8px' }}>
            <Grid container
                display={'flex'}
                justifyContent={'center'}
                style={{ background: '#1975d1', padding: '50px' }}>
                <Grid>
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        bgcolor={'white'}
                        borderRadius={'50%'}
                        padding={'50px'}>

                        {currFile ?
                            <div style={{
                                backgroundImage: `url(${currFile})`,
                                width: 100,
                                height: 100,
                                backgroundSize: '100% 100%',
                            }}></div>
                            : <CameraAltIcon fontSize={'large'} color={'primary'} sx={{ transform: 'scale(3)' }} />}
                    </Box>
                </Grid>
                <Grid size={12} justifyContent={'center'} display={'flex'} mt={'10px'}>
                    <Button component={'h2'} sx={{
                        color: 'white', textAlign: 'center',
                        textTransform: 'none', fontSize: '2 rem'
                    }} variant={'text'} startIcon={<CameraAltIcon fontSize={'large'} sx={{ color: 'white' }} />}
                        //@ts-ignore
                        onClick={() => fileInputRef.current.click()}>
                        Add an avatar
                    </Button>
                    <input type="file" id="file" style={{ display: 'none' }} ref={fileInputRef} accept={'image/*'}
                        onChange={selectFile} />
                </Grid>
            </Grid>
            <Grid container justifyContent={'center'}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    {updateData && <>
                        <Box>
                            <TextField
                                margin="normal"
                                type={'text'}
                                autoFocus
                                variant={'standard'}
                                label={'First name'}
                                name={'firstName'}
                                onSubmit={handleSubmit}
                                value={updateData.firstName}
                                onChange={handleChange}
                                sx={{ m: 2 }} />
                            <TextField
                                margin="normal"
                                type={'text'}
                                autoFocus
                                variant={'standard'}
                                label={'Last name'}
                                name={'lastName'}
                                onSubmit={handleSubmit}
                                onChange={handleChange}
                                value={updateData.lastName}
                                sx={{ m: 2 }} />
                        </Box>
                        <Box>
                            <TextField
                                margin="normal"
                                type={'email'}
                                autoFocus
                                variant={'standard'}
                                label={'Email'}
                                name={'email'}
                                onSubmit={handleSubmit}
                                onChange={handleChange}
                                value={updateData.email}
                                sx={{ m: 2 }} />
                            <TextField
                                margin="normal"
                                type={'text'}
                                autoFocus
                                variant={'standard'}
                                label={'Username'}
                                name={'userName'}
                                onSubmit={handleSubmit}
                                onChange={handleChange}
                                value={updateData.userName}
                                sx={{ m: 2 }} />
                        </Box>
                    </>}
                    <InfoAlert severity={'error'} content={errors!} />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!updateData}
                        sx={{ mt: 3, mb: 2, ml: 2 }}>
                        Update
                    </Button>
                </Box>
            </Grid>
            {responseMessage && <InfoPopupRedux severity={'success'} content={responseMessage} open={!!responseMessage}
                setOpen={setResponseMessage} />}
        </Container>
    );
};