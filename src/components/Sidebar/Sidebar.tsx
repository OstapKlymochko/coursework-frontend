import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {FC, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import AdbIcon from "@mui/icons-material/Adb";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {Divider, Icon, IconButton} from "@mui/material";
import {songsActions} from "../../redux";
import Button from "@mui/material/Button";
import {SmallCollectionCard} from "../SmallCollectionCard/SmallCollectionCard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {CreateCollectionModal} from "../CreateCollectionModal/CreateCollectionModal";

const drawerWidth = 240;


export const Sidebar: FC = () => {
    const dispatch = useAppDispatch();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const {currSong} = useAppSelector(s => s.playerReducer);
    const {collections, searchResult} = useAppSelector(s => s.songsReducer);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const subValue = !!currSong ? 160 : 64;
    useEffect(() => {
        if (!collections.length) dispatch(songsActions.getMyCollections());
    }, []);

    const handleClickHome = () => {
        if (pathname !== '/songs') navigate('/songs');
        if (pathname === '/songs' && !!searchResult.length) dispatch(songsActions.clearSearchResult());
    }

    return (
        <Box sx={{display: 'flex'}}>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth, position: 'relative',  zIndex: 90},
                    }}
                    open>
                    <div style={{marginTop: 2, height: `calc(100vh - ${subValue}px)`}}>
                        <List>
                            <ListItem key={generateUniqueID()}>
                                <ListItemButton onClick={handleClickHome}>
                                    <ListItemIcon>
                                        <HomeIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Home'}/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key={generateUniqueID()}>
                                <ListItemButton onClick={() => navigate('/library')}>
                                    <ListItemIcon>
                                        <LibraryMusicIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Library'}/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                        <Divider/>
                        <Button/>
                        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
                            <IconButton onClick={() => setOpenModal(true)}>
                                <AddCircleIcon/>
                                <Typography>Add new playlist</Typography>
                            </IconButton>
                        </Box>
                        <List>
                            {collections.map(i => <ListItem key={generateUniqueID()}>
                                <SmallCollectionCard collection={i}/>
                            </ListItem>)}
                        </List>
                    </div>
                </Drawer>
            </Box>
            <CreateCollectionModal open={openModal} setOpen={setOpenModal}/>
        </Box>
    );
}