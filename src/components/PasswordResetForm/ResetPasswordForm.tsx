import React, { useState } from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { ThemedTextField } from "../ThemedTextField/ThemedTextField";
import { InfoAlert } from "../InfoAlert/InfoAlert";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useForm } from "react-hook-form";
import { IBasicResponse, IResetPassword } from "../../interfaces";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import { authService } from "../../services";

interface IResetPasswordData extends IResetPassword {
    confirmPassword: string
}

export const ResetPasswordForm = () => {
    const { register, handleSubmit } = useForm<IResetPasswordData>();
    const [errors, setErrors] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const resetPassword = async (resetPasswordData: IResetPasswordData) => {
        const { password, confirmPassword } = resetPasswordData;
        if (password !== confirmPassword) return setErrors('Passwords don\'t match');
        try {
            await authService.resetPassword({
                password: resetPasswordData.password,
                validationToken: searchParams.get('token')
            } as IResetPassword);
            if (!!errors) setErrors(null);
            navigate('/login')
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            setErrors(response!.data.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Avatar sx={{ m: 1 }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Restore Password
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit(resetPassword)} sx={{ mt: 3 }}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={12}>
                            <ThemedTextField
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="new-password"
                                {...register('password')} />
                        </Grid>
                        <Grid size={12}>
                            <ThemedTextField
                                required
                                fullWidth
                                label="Confirm password"
                                type="password"
                                autoComplete="new-password"
                                {...register('confirmPassword')} />
                        </Grid>
                    </Grid>
                    <InfoAlert severity={'error'} content={errors!} />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Restore password
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid>
                            <Link component={'button'} onClick={() => navigate('/login')} variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};