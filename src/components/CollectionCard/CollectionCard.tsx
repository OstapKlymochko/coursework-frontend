import React, { FC } from 'react';
import { ISongsCollection } from "../../interfaces";
import { Card, CardContent, CardMedia } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import './index.css';

interface IProps {
    collection: ISongsCollection;
}

export const CollectionCard: FC<IProps> = ({ collection }) => {
    const navigate = useNavigate();
    // const { isPlaying, trackList } = useAppSelector(s => s.playerReducer)
    // const StateIcon = isPlaying && !!trackList.songs.length && trackList.id === collection.id ? PauseCircleOutlinedIcon : PlayCircleOutlineOutlinedIcon

    return (
        <Container maxWidth={'xs'}>
            <Card sx={{ maxWidth: 200 }}>
                <CardMedia
                    component="img"
                    sx={{
                        maxWidth: 151,
                        boxSizing: 'border-box',
                        objectFit: 'contain',
                        minWidth: '100%'
                        // filter: isMouseOver ? 'brightness(50%)' : ''
                    }}
                    image={collection.imageUrl}
                    height={150}
                    alt="collection logo"
                    loading={'lazy'} />
                <Box sx={{ width: 150 }}>
                    <CardContent>
                        <Box>
                            <Link className={'title-link'}>
                                <Typography component="div" variant={'h6'}
                                    onClick={() => navigate(`/library/${collection.id}`, { state: collection })}>
                                    <b>{collection.title}</b>
                                </Typography>
                            </Link>
                        </Box>
                        <Box>
                            <Typography>{collection.ownerUserName}</Typography>
                            <Typography>{collection.songsCount} songs</Typography>
                        </Box>
                    </CardContent>
                </Box>
            </Card>
        </Container>
    );
};