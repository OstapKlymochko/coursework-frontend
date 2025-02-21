import React, { useEffect, useRef, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import AdbIcon from "@mui/icons-material/Adb";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { authActions, songsActions } from "../../redux";
import { v4 as uuid } from "uuid";
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import { ISongsFilterParameters } from '../../interfaces';

export const Header = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const user = useAppSelector(u => u.authReducer.user);
    const searchSuggestions = useAppSelector(s => s.songsReducer.searchSuggestions);
    const [options, setOptions] = useState(searchSuggestions);
    const [value, setValue] = useState('');
    const { logout } = authActions;
    const navigate = useNavigate();
    const { pathname } = useLocation()

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        setOptions(searchSuggestions)
    }, [searchSuggestions])


    useEffect(() => {
        if (value) dispatch(songsActions.getSongSearchSuggestions(value));
    }, [value]);

    const fetchSongs = (key: string) => {
        const filter: ISongsFilterParameters = { skip: 0, select: 10 };
        if (key) filter.key = key;
        dispatch(songsActions.getSongsList(filter));
    }

    const handleLogoClick = () => {
        if (pathname !== '/songs') navigate('/songs');
        else {
            setValue('');
            dispatch(songsActions.clearSearchResult());
        }
    }

    return (
        <AppBar position="static">
            <Grid container bgcolor={'#505172'}>
                <Grid size={1}>
                    <div style={{ display: 'flex' }} className={'pointer'} onClick={handleLogoClick}>
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex', color: 'white' }, mr: 1, mt: 2 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            sx={{
                                mr: 2,
                                mt: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                textDecoration: 'none',
                                color: 'white'
                            }}>
                            LOGO
                        </Typography>
                    </div>
                </Grid>
                <Grid size={11}>
                    <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Toolbar disableGutters>
                            <Box sx={{ mr: 2, width: 250 }}>
                                <Autocomplete
                                    freeSolo
                                    id="free-solo-2-demo"
                                    options={value !== '' ? options : []} renderOption={(props, option) => (
                                        <Box component={'li'} {...props} key={uuid()} onClick={_ => fetchSongs(option)}>
                                            {option}
                                        </Box>
                                    )}
                                    renderInput={params => <TextField
                                        {...params}
                                        value={value}
                                        label="Search input"
                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                                        onKeyDown={(e) => { if (e.code === 'Enter' && !!value) fetchSongs(value); }}
                                    />
                                    } />
                            </Box>
                            <Box>
                                <ThemeSwitcher />
                            </Box>
                            <Box sx={{ flexGrow: 0, pl: 10 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, justifyContent: 'flex-start' }}>
                                        <Avatar alt={user?.firstName ? user.firstName[0] : 'u'}
                                            src={user?.avatarUrl ?? ''} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}>
                                    <MenuItem key={'profile'} onClick={() => {
                                        handleCloseUserMenu();
                                        navigate('/me');
                                    }}>
                                        <Typography textAlign="center">Profile</Typography>
                                    </MenuItem>
                                    <MenuItem key={'logout'} onClick={() => {
                                        handleCloseUserMenu();
                                        dispatch(logout());
                                        navigate('/login');
                                    }}>
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </Grid>
            </Grid>
        </AppBar>
    );
}