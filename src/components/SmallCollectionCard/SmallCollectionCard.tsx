import React, {FC} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks";
import {IconButton, Box, Card, CardContent, Typography} from "@mui/material";
import {ISongsCollection} from "../../interfaces";
import {useNavigate} from "react-router-dom";
import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import {playerActions} from "../../redux";
import Grid from "@mui/material/Grid2";

interface IProps {
    collection: ISongsCollection;
}

export const SmallCollectionCard: FC<IProps> = ({collection}) => {
    const {isPlaying, trackList} = useAppSelector(s => s.playerReducer);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handlePlayClick = () => {
        if (isPlaying && trackList.id === collection.id) dispatch(playerActions.pause());
        else if (trackList.id === collection.id && !!trackList.songs.length) dispatch(playerActions.play());
        else navigate(`/library/${collection.id}`, {state: collection});
    }

    const StateIcon = isPlaying && !!trackList.songs.length && trackList.id === collection.id ? PauseCircleOutlinedIcon : PlayCircleOutlineOutlinedIcon
    return (
        <div style={{marginTop: 5, width: '100%', height: 50}}>
            <Card sx={{display: 'flex', width: '100%'}}>
                <Box sx={{width: '100%'}} height={50}>
                    <Grid container width={'100%'}>
                        <Grid size={3}>
                            <div style={{
                                backgroundImage: `url(${collection.imageUrl})`,
                                width: 50,
                                height: 50,
                                backgroundSize: '100% 100%'
                            }}>
                            </div>
                        </Grid>
                        <Grid size={7}
                              sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-start',
                                  justifyContent: 'center'
                              }}
                              className={'pointer'}>
                            <CardContent sx={{flex: '1 0 auto'}}
                                         onClick={() => navigate(`/library/${collection.id}`, {state: collection})}>
                                <Typography component="div" variant="h5" fontSize={'medium'} textAlign={'left'}>
                                    {collection.title}
                                </Typography>
                            </CardContent>
                        </Grid>
                        <Grid size={2}
                              sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <IconButton onClick={handlePlayClick}>
                                <StateIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </div>
    );
};