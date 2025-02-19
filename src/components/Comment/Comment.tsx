import React, { FC } from 'react';
import { IComment } from "../../interfaces";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import Grid from "@mui/material/Grid2";
import { statisticsActions } from "../../redux";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { v4 as uuid } from "uuid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface IProps {
    comment: IComment;
    handleReply: (id: number, text: string) => void;
    handleEditComment: (comment: IComment) => void;
    handleDelete: (comment: IComment) => void;
}

export const Comment: FC<IProps> = ({ comment, handleReply, handleDelete, handleEditComment }) => {
    const dispatch = useAppDispatch();
    const { songDetails } = useAppSelector(s => s.songsReducer);
    const { user } = useAppSelector(s => s.authReducer);

    const handleLoadRepliesClick = () => {
        const page = Math.floor((comment.replies?.length || 0) / 10);
        if (comment.replies?.length === comment.repliesCount) return;
        dispatch(statisticsActions.getSongCommentsPaginated({
            select: 10,
            skip: page * 10,
            songId: comment.songId,
            parentCommentId: comment.id
        }));
    }

    const handleReplyClick = () => {
        handleReply(comment.id, `@${comment.userName} , `);
    }

    const handleHideReplies = () => {
        dispatch(statisticsActions.clearCommentReplies(comment.id));
    }

    const repliesCount = comment.replies?.length || 0;
    const replies = (comment.repliesCount! - repliesCount) % 10 === 1 ? 'Reply' : 'Replies';

    return (
        <Container>
            <CommentData handleLoadRepliesClick={handleLoadRepliesClick} handleReplyClick={handleReplyClick}
                comment={comment} isReply={false} key={uuid()} userId={user!.id}
                songAuthorId={songDetails!.authorId}
                handleDelete={handleDelete} handleEditComment={handleEditComment}
            />
            {!!comment.replies?.length && <Container>
                {comment.replies.map(c => <CommentData handleLoadRepliesClick={handleLoadRepliesClick}
                    handleReplyClick={handleReplyClick}
                    userId={user!.id} songAuthorId={songDetails!.authorId}
                    comment={c} key={uuid()} isReply={true}
                    handleDelete={handleDelete} handleEditComment={handleEditComment} />
                )}
                <Box width={'100%'} display={'flex'} justifyContent={'center'}>
                    {comment.replies.length !== 0 && <IconButton onClick={handleHideReplies}>
                        <Typography color={'primary'}>Hide</Typography>
                    </IconButton>}
                    {(repliesCount < (comment.repliesCount ?? 0)) && <IconButton onClick={handleLoadRepliesClick}>
                        <Typography
                            color={'primary'}>Load {comment.repliesCount! - repliesCount} more {replies}</Typography>
                    </IconButton>}
                </Box>
            </Container>}
        </Container>
    );
};

interface ICommentDataProps extends Pick<IProps, 'comment'> {
    handleLoadRepliesClick: () => void;
    handleReplyClick: () => void;
    isReply: boolean;
    userId: number;
    songAuthorId: number;
    handleEditComment: (comment: IComment) => void;
    handleDelete: (comment: IComment) => void;
}

const CommentData: FC<ICommentDataProps> = ({
    comment,
    handleLoadRepliesClick,
    handleReplyClick,
    isReply = false,
    userId,
    songAuthorId,
    handleDelete,
    handleEditComment
}) => {
    const date = new Date();
    const localDate = new Date(comment.createdAt.toString()).getTime() - date.getTimezoneOffset() * 60000;

    const repliesCount = comment.replies?.length || 0;
    const replies = (comment.repliesCount! - repliesCount) % 10 === 1 ? 'Reply' : 'Replies';
    return (
        <>
            <Box display={'flex'} alignItems={'center'} columnGap={1}>
                <Avatar alt={comment.userName[0].toUpperCase()}
                    src={comment.avatarFileKey || ''} />
                <Typography>{comment.userName}</Typography>
                <Typography>{new Date(localDate).toLocaleString()}</Typography>
                <CommentMenu comment={comment} userId={userId} songAuthorId={songAuthorId}
                    handleDelete={handleDelete} handleEditComment={handleEditComment} />
            </Box>
            <Box ml={6}>
                <Typography>{comment.body}</Typography>
            </Box>
            <Grid container width={'100%'}>
                <Grid size={4}>
                    {comment.edited &&
                        <Typography variant="subtitle1" color="text.secondary" component="div"
                            fontSize={'small'}>Edited</Typography>}
                </Grid>
                <Grid size={4}>
                    {!!comment.repliesCount && !comment.replies?.length && !isReply &&
                        <IconButton onClick={handleLoadRepliesClick}>
                            <Typography
                                color={'primary'}>Load {comment.repliesCount - repliesCount} {replies}</Typography>
                        </IconButton>}
                </Grid>
                <Grid size={4} display={'flex'} justifyContent={'flex-end'}>
                    <IconButton onClick={handleReplyClick}>
                        <Typography mr={1}>Reply</Typography>
                        <ReplyRoundedIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </>
    );
};

const CommentMenu: FC<Partial<ICommentDataProps>> = ({
    comment,
    userId,
    songAuthorId,
    handleEditComment,
    handleDelete
}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const menuItems = [];
    if (comment?.userId === userId || userId === songAuthorId) menuItems.push(<MenuItem
        onClick={() => handleDelete!(comment!)}>Delete</MenuItem>);
    if (comment?.userId === userId) menuItems.push(<MenuItem
        onClick={() => handleEditComment!(comment!)}>Edit</MenuItem>);
    if (!menuItems.length) return <></>
    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                    },
                }}>
                {menuItems.map(i => i)}
            </Menu>
        </div>
    );
}