import {
    IBasicResponse,
    ICollectionsList, ICreateSongCollection,
    IGenre,
    ISongDetails,
    ISongsList,
    ISongsService,
    IUpdateCollection
} from "../interfaces";
import {apiService, IRes} from "./apiService";
import {urls} from "../configs";

export const songsService: ISongsService = {
    getSongs: (select: number, skip: number, key = ''): IRes<ISongsList> => apiService.get(urls.songs.get, {
        params: {
            select,
            skip,
            key
        }
    }),
    getSongSuggestions: (key: string) => apiService.get(urls.songs.getSuggestions, {
        params: {key}
    }),
    getSongById: (id: number): IRes<ISongDetails> => apiService.get(urls.songs.get + '/' + id),
    uploadSong: (song: FormData): IRes<IBasicResponse> => apiService.post(urls.songs.create, song),
    getGenres: (): IRes<IGenre[]> => apiService.get(urls.songs.genres),
    getMyPlaylists: (): IRes<ICollectionsList> => apiService.get(urls.songs.collections),
    getCollectionSongs: (id: number): IRes<ISongsList> => apiService.get(urls.songs.collections + `/${id}`),
    createCollection: (payload: ICreateSongCollection) => apiService.post(urls.songs.collections, payload),
    removeCollection: (id: number) => apiService.delete(urls.songs.collections + `/${id}`),
    addSongToCollection: (payload: IUpdateCollection) => apiService.put(urls.songs.addSongToCollection, payload),
    removeSongFromCollection: (payload: IUpdateCollection) => apiService.put(urls.songs.removeSongFromCollection, payload),
    getSongStatistics: (songId: number) => apiService.get(urls.songs.get + `/${songId}/statistics`),
    postSongListened: (songId: number) => apiService.post(urls.songs.views + `/${songId}`)
}