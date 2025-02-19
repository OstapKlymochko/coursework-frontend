import {ICreateComment, IStatisticsService, IUpdateComment} from "../interfaces";
import {apiService} from "./apiService";
import {urls} from "../configs";
import {IReaction} from "../interfaces";
import {ICommentsFilterParameters} from "../interfaces";


export const statisticsService: IStatisticsService = {
    getSongCommentsPaginated: (songId: number, params: ICommentsFilterParameters) =>
        apiService.get(urls.statistics.comments + `/${songId}`, {params}),
    createComment: (comment: ICreateComment) => apiService.post(urls.statistics.comments, comment),
    deleteComment: (id: number) => apiService.delete(urls.statistics.comments + `/${id}`),
    postReaction: (reaction: IReaction) => apiService.post(urls.statistics.reaction, reaction),
    deleteReaction: (songId: number) => apiService.delete(urls.statistics.reaction + `/${songId}`),
    updateComment: (comment: IUpdateComment) => apiService.put(urls.statistics.comments, comment)
}