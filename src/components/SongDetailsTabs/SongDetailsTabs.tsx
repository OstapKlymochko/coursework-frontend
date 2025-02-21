import { Box, IconButton, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Typography from "@mui/material/Typography";
import { SmallSongCard } from "../SmallSongCard/SmallSongCard";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { v4 as uuid } from "uuid";
import { Comment } from "../Comment/Comment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IComment, ICreateComment } from "../../interfaces";
import { statisticsActions } from "../../redux";
import { InfoPopupRedux } from "../InfoPopupRedux/InfoPopupRedux";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>

            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const SongDetailsTabs = () => {
    const { commentsListStruct, currSongId, errors } = useAppSelector(s => s.statisticsReducer);
    const { trackList } = useAppSelector(s => s.playerReducer);
    const { user } = useAppSelector(s => s.authReducer);
    const [commentData, setCommentData] = useState<ICreateComment>({
        songId: currSongId ?? 0,
        body: '',
        userName: user?.userName ?? ''
    });
    const page = Math.ceil(commentsListStruct.comments.length / 10);

    const [value, setValue] = React.useState(0);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!!currSongId && currSongId !== commentData.songId) setCommentData(p => ({ ...p, songId: currSongId }));
    }, [currSongId])

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const setCommentBody = (text: string) => {
        setCommentData(p => {
            if (!text && (!!p.id || !!p.repliedTo)) {
                p.id = null;
                p.repliedTo = null;
            }
            p.body = text;
            return { ...p };
        })
    }

    const handleReply = (commentId: number, text: string) => {
        setCommentData(p => ({ ...p, body: text, repliedTo: commentId }));
    }

    const handleCommentBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentBody(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent) => {
        if (!commentData) return;
        e.preventDefault();
        if (!!commentData.id) dispatch(statisticsActions.updateComment({
            commentId: commentData.id,
            body: commentData.body
        }));
        else dispatch(statisticsActions.createComment(commentData));
        setCommentData(p => ({ ...p, id: null, body: '', repliedTo: null }));
    }

    const loadMoreComments = () => {
        dispatch(statisticsActions.getSongCommentsPaginated({ songId: currSongId!, skip: page * 10, select: 10 }));
    }

    const handleEditComment = (comment: IComment) => {
        setCommentData({ ...comment });
        window.scrollTo({ top: 0 })
    }

    const handleDelete = (comment: IComment) => {
        dispatch(statisticsActions.deleteComment(comment));
    }

    const handleCancelEdit = () => {
        setCommentData(p => ({ ...p, id: null, body: '', repliedTo: null }));
    }
    
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} textColor='secondary'
                    aria-label="basic tabs example" variant="fullWidth">
                    <Tab label="Track list" {...a11yProps(1)} />
                    <Tab label="Comments" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Box height={'70vh'} sx={{ position: 'relative', overflowY: 'scroll' }}>
                    {trackList.songs.map(s => <SmallSongCard key={uuid()} song={s} />)}
                    {!trackList.songs.length && <Typography>Empty</Typography>}
                </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Box height={'70vh'} sx={{ position: 'relative', overflowY: 'scroll' }}>
                    <form onSubmit={handleSubmit}
                        style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                        <TextField
                            onChange={handleCommentBodyChange}
                            variant={'standard'}
                            fullWidth={true}
                            value={commentData.body}
                            placeholder={'Comment...'} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button sx={{ marginLeft: '120' }} disabled={!commentData.id}
                                onClick={handleCancelEdit} variant='text'>Cancel</Button>
                            <Button sx={{ marginLeft: '150' }} type={'submit'} variant='text'>Comment</Button>
                        </Box>
                    </form>
                    {!!commentsListStruct.comments.length && commentsListStruct.comments.map(c =>
                        <Comment key={uuid()} comment={c} handleReply={handleReply}
                            handleEditComment={handleEditComment}
                            handleDelete={handleDelete} />)}
                    {!commentsListStruct.comments.length && <Typography>No comments yet</Typography>}
                    {page <= commentsListStruct.pagesCount - 1 &&
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton onClick={loadMoreComments}>
                                <Typography color={'primary'}>Load More</Typography>
                            </IconButton>
                        </Box>}
                </Box>
            </CustomTabPanel>
            <InfoPopupRedux severity={'error'} content={errors ?? ''} open={!!errors}
                setOpen={statisticsActions.setErrors} />
        </Box>
    );
};