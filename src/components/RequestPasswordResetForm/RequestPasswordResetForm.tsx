import React, { useState } from 'react';
import { Container, Box, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { ThemedTextField } from "../ThemedTextField/ThemedTextField";
import { InfoAlert } from "../InfoAlert/InfoAlert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IBasicResponse, IRequestPasswordReset } from "../../interfaces";
import { authService } from "../../services";
import { AxiosError } from "axios";

export const RequestPasswordResetForm = () => {
    const { register, handleSubmit } = useForm<IRequestPasswordReset>();
    const [errors, setErrors] = useState<string | null>(null);
    const navigate = useNavigate();
    const requestPasswordReset = async (requestResetData: IRequestPasswordReset) => {
        try {
            await authService.requestPasswordReset(requestResetData);
            if (!!errors) setErrors(null);
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            setErrors(response!.data.message);
        }
    }
    const theme = useTheme();

    return (
        <Container component="main" maxWidth="xs" sx={{ boxSizing: 'border-box' }}>
            <Box
                sx={{
                    // mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h2" variant="body1" 
                    textAlign={'center'} fontSize={13} fontWeight={'bold'}>
                    Please enter your email address, username or phone number associated with your account and we'll
                    send you
                    an email with further instruction
                </Typography>
                <Box component="form" onSubmit={handleSubmit(requestPasswordReset)} noValidate sx={{ mt: 1 }}>
                    <ThemedTextField
                        margin="normal"
                        required
                        fullWidth
                        type={'text'}
                        autoFocus
                        // variant={'standard'}
                        {...register('identifier')}
                        sx={{ mb: 2 }} />
                    <InfoAlert severity={'error'} content={errors!} />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Send request
                    </Button>
                    <Grid container>
                        <Grid>
                            <Link component={'button'} onClick={() => navigate('/login')} variant="body2">
                                Back to sign in
                            </Link>
                        </Grid>
                        <Grid>
                            <Link component={'button'} onClick={() => navigate('/register')} variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};