import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {FC, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {IBasicResponse, IRegister, IRole} from "../../interfaces";
import {authService, rolesService} from "../../services";
import {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";
import {InfoAlert} from "../InfoAlert/InfoAlert";
import {Dropdown} from "../Dropdown/Dropdown";

const defaultTheme = createTheme();

interface IRegisterData extends IRegister {
    confirmPassword: string
}

export const RegisterForm: FC = () => {
    const {register, handleSubmit} = useForm<IRegisterData>();
    const [roles, setRoles] = useState<IRole[]>([]);
    const [errors, setErrors] = useState<string | null>();
    const [role, setRole] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        rolesService.getAll().then(({data}) => setRoles(data)).catch(e => {
            const {response} = e as AxiosError<IBasicResponse>;
            setErrors(response!.data.message);
        })
    }, [])

    const registerSubmit = async (userData: IRegisterData): Promise<void> => {
        const {password, confirmPassword} = userData;
        if (password !== confirmPassword) return setErrors("Passwords don't match");
        try {
            // console.log({
            //     ...userData,
            //     email: userData.email.trim().toLowerCase(),
            //     role: role || 'User'
            // })
            await authService.register({
                ...userData,
                email: userData.email.trim().toLowerCase(),
                role: role || 'User'
            } as IRegister);
            navigate('/login');
            if (!!errors) setErrors(null);
        } catch (e) {
            const {response} = e as AxiosError<IBasicResponse>;
            setErrors(response!.data.message);
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit(registerSubmit)} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    autoComplete="email"
                                    {...register('email')}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Username"
                                    autoComplete={'username'}
                                    {...register('username')}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('password')}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Confirm password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('confirmPassword')}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Dropdown title={"Role"} menuItems={roles.map(i => ({label: i.name, value: i.name}))}
                                          setSelectedItem={setRole}
                                          selectedItem={role || ''}/>
                            </Grid>
                        </Grid>
                        <InfoAlert severity={'error'} content={errors!}/>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}>
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={'button'} onClick={() => navigate('/login')} variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}