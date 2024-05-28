import React, {FC, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {ILogin} from "../../interfaces";
import {useLocation, useNavigate} from "react-router-dom";

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
import {InfoAlert} from "../InfoAlert/InfoAlert";

import {authActions} from "../../redux";
import {useAppDispatch, useAppSelector} from "../../hooks";

export const LoginForm: FC = () => {
    const {register, handleSubmit} = useForm<ILogin>();
    // const [errors, setErrors] = useState<string | null>(null);
    const navigate = useNavigate();
    const {state} = useLocation();
    const {login: loginRedux, setErrors} = authActions;
    const dispatch = useAppDispatch();
    const {errors} = useAppSelector(s => s.authReducer);
    useEffect(() => {
        if (state?.sessionExpired) dispatch(setErrors('Session expired'));
    }, [state?.sessionExpired, setErrors, dispatch])
    const login = async (credentials: ILogin) => {
        try {
            await dispatch(loginRedux(credentials)).unwrap();
            navigate('/songs')
        } catch (e) {
            console.error(e);
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
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(login)} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            type={'email'}
                            autoComplete="email"
                            autoFocus
                            {...register('email')}/>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            autoFocus
                            {...register('password')}/>
                        <InfoAlert severity={'error'} content={errors!}/>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}>
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link component={'button'} onClick={() => navigate('/forgot-password')} variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link component={'button'} onClick={() => navigate('/register')} variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

const defaultTheme = createTheme();
