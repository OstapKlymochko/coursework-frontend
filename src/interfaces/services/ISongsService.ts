import {IRes} from "../../services";
import {IBasicResponse} from "../IBasicResponse";
import {IGenre} from "../IGenre";
import {ISongDetails} from "../ISongDetails";
import {ISongsList} from "../ISongsList";
import {ICollectionsList} from "../ICollectionsList";
import {ICreateSongCollection} from "../ICreateSongCollection";
import {IUpdateCollection} from "../IUpdateCollection";
import {ISongStatistics} from "../ISongStatistics";
import {ISearchSongSuggestions} from "../ISearchSongSuggestions";

export interface ISongsService {
    getSongs: (select: number, skip: number, key: string) => IRes<ISongsList>,
    getSongSuggestions: (key: string) => IRes<ISearchSongSuggestions>,
    getSongById: (id: number) => IRes<ISongDetails>,
    uploadSong: (payload: FormData) => IRes<IBasicResponse>,
    getGenres: () => IRes<IGenre[]>,
    getMyPlaylists: () => IRes<ICollectionsList>,
    getCollectionSongs: (id: number) => IRes<ISongsList>,
    createCollection: (payload: ICreateSongCollection) => IRes<IBasicResponse>,
    removeCollection: (id: number) => IRes<IBasicResponse>,
    addSongToCollection: (payload: IUpdateCollection) => IRes<IBasicResponse>,
    removeSongFromCollection: (payload: IUpdateCollection) => IRes<IBasicResponse>,
    getSongStatistics: (songId: number) => IRes<ISongStatistics>,
    postSongListened: (songId: number) => IRes<any>
}