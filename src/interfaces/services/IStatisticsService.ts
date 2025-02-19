import {IReaction} from "../IReaction";
import {IRes} from "../../services";
import {ICommentsList} from "../ICommentsList";
import {ICommentsFilterParameters} from "../ICommentsFilterParameters";
import {ICreateComment} from "../ICreateComment";
import {IUpdateComment} from "../IUpdateComment";
import {IComment} from "../IComment";

export interface IStatisticsService {
    postReaction: (payload: IReaction) => IRes<any>,
    deleteReaction: (id: number) => IRes<any>,
    getSongCommentsPaginated: (songId: number, params: ICommentsFilterParameters) => IRes<ICommentsList>,
    createComment: (comment: ICreateComment) => IRes<IComment>,
    updateComment: (comment: IUpdateComment) => IRes<any>,
    deleteComment: (id: number) => IRes<any>
}