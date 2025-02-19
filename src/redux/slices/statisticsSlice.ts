import { ICommonState } from "../common/ICommonState";
import {
    IBasicResponse, IComment,
    ICommentsFilterParameters,
    ICreateComment,
    IReaction,
    IUpdateComment
} from "../../interfaces";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICommentsList } from "../../interfaces/ICommentsList";
import { AxiosError } from "axios";
import { statisticsService } from "../../services";
import {
    setErrors as setErrorsFunc,
    setResponseMessage as setResponseMessageFunc
} from "../common/defaultSetStateActions";
import { songsActions } from "./songsSlice";

interface IGetCommentsParams extends ICommentsFilterParameters {
    songId: number
}

const getSongCommentsPaginated = createAsyncThunk<ICommentsList, IGetCommentsParams>('statisticsSlice/getSongCommentsPaginated',
    async (params, { rejectWithValue }) => {
        try {
            const { songId, ...rest } = params;
            const { data } = await statisticsService.getSongCommentsPaginated(songId, rest);
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    }
)

const createComment = createAsyncThunk<IComment, ICreateComment>('statisticsSlice/createComment',
    async (comment, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await statisticsService.createComment(comment);
            dispatch(songsActions.getSongById(comment.songId))
            return data;
        } catch
        (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    }
)
    ;

const updateComment = createAsyncThunk<any, IUpdateComment>('statisticsSlice/updateComment',
    async (comment, { rejectWithValue }) => {
        try {
            const { data } = await statisticsService.updateComment(comment);
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });

const postReaction = createAsyncThunk<any, IReaction>('statisticsSlice/postReaction',
    async (reaction, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await statisticsService.postReaction(reaction);
            dispatch(songsActions.getSongById(reaction.songId))
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });

const deleteReaction = createAsyncThunk<any, number>('statisticsSlice/deleteReaction',
    async (songId, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await statisticsService.deleteReaction(songId);
            dispatch(songsActions.getSongById(songId))
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });

const deleteComment = createAsyncThunk<any, IComment>('statisticsSlice/deleteComment',
    async (comment, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await statisticsService.deleteComment(comment.id);
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });


interface IState extends ICommonState {
    currSongId: number | null;
    commentsListStruct: ICommentsList;
}

const initialState: IState = {
    currSongId: null,
    commentsListStruct: { comments: [], pagesCount: 0 },
    errors: null,
    responseMessage: null
}

const statisticsSlice = createSlice({
    name: 'statisticsSlice',
    initialState,
    reducers: {
        setErrors: setErrorsFunc,
        setResponseMessage: setResponseMessageFunc,
        clearComments: (state: IState) => {
            state.commentsListStruct.comments = [];
            state.commentsListStruct.pagesCount = 0;
        },
        setCurrSongId: (state: IState, action: PayloadAction<number | null>) => {
            state.currSongId = action.payload;
        },
        clearCommentReplies: (state: IState, action: PayloadAction<number>) => {
            const commentIndex = state.commentsListStruct.comments.findIndex(c => c.id === action.payload);
            if (commentIndex === -1) return;
            state.commentsListStruct.comments[commentIndex].replies = [];
        }
    },
    extraReducers: builder => builder
        .addCase(getSongCommentsPaginated.fulfilled, (state, action) => {
            const { comments, pagesCount } = action.payload;
            if (!comments.length) return;
            const { comments: currComments } = state.commentsListStruct;
            const parentId = action.meta.arg.parentCommentId;
            if (!parentId) {
                state.commentsListStruct.comments = [...currComments, ...comments.map(c => ({ ...c, replies: [] }))];
                state.commentsListStruct.pagesCount = pagesCount;
                return;
            } else if (!currComments.length) return;
            const commentIndex = currComments.findIndex(c => c.id === parentId);
            if (commentIndex === -1) return;
            state.commentsListStruct.comments[commentIndex].replies?.push(...comments.filter(c => {
                return currComments[commentIndex].replies?.findIndex(i => i.id === c.id) === -1;
            }));
        })
        .addCase(getSongCommentsPaginated.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(createComment.fulfilled, (state, action) => {
            const repliedTo = action.meta.arg.repliedTo
            const comment = action.payload;
            if (!repliedTo) {
                state.commentsListStruct.comments.unshift(comment);
                return;
            }
            const commentIndex = state.commentsListStruct.comments.findIndex(c => c.id === repliedTo);
            state.commentsListStruct.comments[commentIndex].replies?.unshift(comment);
            ++state.commentsListStruct.comments[commentIndex].repliesCount!;
        })
        .addCase(createComment.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(updateComment.fulfilled, (state, action) => {
            const { commentId, body } = action.meta.arg;
            for (const c of state.commentsListStruct.comments) {
                if (c.id === commentId) {
                    c.edited = true;
                    c.body = body;
                    return;
                }
                const i = (c.replies || []).findIndex(i => i.id === commentId);
                if (i === -1) continue;
                c.replies![i].edited = true;
                c.replies![i].body = body;
            }
        })
        .addCase(updateComment.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(postReaction.fulfilled, (state, action) => {
        })
        .addCase(postReaction.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(deleteReaction.fulfilled, (state, action) => {
        })
        .addCase(deleteReaction.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(deleteComment.fulfilled, (state, action) => {
            const comment = action.meta.arg;
            for (const c of state.commentsListStruct.comments) {
                if (c.id === comment.id) {
                    state.commentsListStruct.comments = state.commentsListStruct.comments.filter(i => i.id !== c.id);
                    return;
                }
                const i = (c.replies || []).findIndex(i => i.id === comment.id);
                if (i === -1) continue;
                c.replies?.splice(i, 1);
                c.repliesCount! -= 1;
            }
        })
        .addCase(deleteComment.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
});

const { reducer: statisticsReducer, actions } = statisticsSlice;
const { clearCommentReplies, setErrors, setResponseMessage, clearComments, setCurrSongId } = actions;

const statisticsActions = {
    getSongCommentsPaginated,
    createComment,
    updateComment,
    postReaction,
    deleteReaction,
    setErrors,
    setResponseMessage,
    clearComments,
    setCurrSongId,
    clearCommentReplies,
    deleteComment
}

export {
    statisticsReducer,
    statisticsActions
}