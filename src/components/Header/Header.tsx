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
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { authActions, songsActions } from "../../redux";
import { Autocomplete, TextField } from "@mui/material";
import { v4 as uuid } from "uuid";
import Grid from "@mui/material/Grid2";
import AdbIcon from "@mui/icons-material/Adb";
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';

export const Header = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(u => u.authReducer);
    const { searchSuggestions } = useAppSelector(s => s.songsReducer);
    const [options, setOptions] = useState(searchSuggestions);
    const { logout } = authActions;
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return;
        dispatch(songsActions.getSongSearchSuggestions(e.target.value || ''));
    }
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        setOptions(searchSuggestions)
    }, [searchSuggestions])

    return (
        <AppBar position="static">
            <Grid container bgcolor={'secondary.main'}>
                <Grid size={1}>
                    <div style={{ display: 'flex' }} className={'pointer'} onClick={() => navigate('/songs')}>
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, mt: 2 }} />
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
                                color: 'inherit',
                                textDecoration: 'none',
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
                                    // disableClearable
                                    options={inputRef?.current?.value !== '' ? options : []}
                                    renderOption={(props, option) => <li {...props}
                                        onClick={_ => {
                                            dispatch(songsActions.getSongsList({
                                                skip: 0,
                                                select: 10,
                                                key: option
                                            }));
                                            inputRef.current!.value = option;
                                        }}
                                        key={uuid()}>{option}</li>}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Search input"
                                            InputProps={{
                                                ...params.InputProps,
                                                type: 'search',
                                            }}
                                            inputRef={inputRef}
                                            onInput={onSearchInput}
                                            onKeyDown={e => {
                                                //@ts-ignore
                                                if (e.code === 'Enter' && !!e.target.value) {
                                                    dispatch(songsActions.getSongsList({
                                                        skip: 0,
                                                        select: 10,
                                                        //@ts-ignore
                                                        key: e.target.value
                                                    }))
                                                }
                                            }}
                                        />
                                    )} />
                            </Box>
                            <Box>
                                <ThemeSwitcher />
                            </Box>
                            <Box sx={{ flexGrow: 0, pl: 10 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, justifyContent: 'flex-start' }}>
                                        <Avatar alt={user?.firstName ? user.firstName[0] : 'u'}
                                            src={user?.avatarUrl || ''} />
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