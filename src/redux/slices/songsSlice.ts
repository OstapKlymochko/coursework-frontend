import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    ISong,
    IGenre,
    ISongsFilterParameters,
    IBasicResponse,
    ISongDetails,
    ISongsList,
    ICollectionsList,
    ISongsCollection,
    ICreateSongCollection,
    IUpdateCollection,
    ISongStatistics,
    ISearchSongSuggestions
} from "../../interfaces";
import { AxiosError } from "axios";
import { songsService } from "../../services";
import { ICommonState } from "../common/ICommonState";
import {
    setErrors as setErrorsFunc,
    setResponseMessage as setResponseMessageFunc
} from "../common/defaultSetStateActions";


const getSongsList = createAsyncThunk<ISongsList, ISongsFilterParameters>('songsSlice/getSongsList',
    async ({ select, skip, key }, { rejectWithValue }) => {
        try {
            const { data } = await songsService.getSongs(select, skip, key || '');
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });
const getSongSearchSuggestions = createAsyncThunk<ISearchSongSuggestions, string>('songsSlice/getSuggestions',
    async (key, { rejectWithValue }) => {
        try {
            const { data } = await songsService.getSongSuggestions(key);
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    })
const getMyCollections = createAsyncThunk<ICollectionsList>('songsSlice/getCollectionsList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await songsService.getMyPlaylists();
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    }
)
const getCollectionSongs = createAsyncThunk<ISongsList, number>('songsSlice/getCollectionSongs',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await songsService.getCollectionSongs(id);
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    }
)
const getSongById = createAsyncThunk<ISongDetails, number>('songsSlice/getSongById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await songsService.getSongById(id);
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });

const uploadSong = createAsyncThunk<IBasicResponse, FormData>('songsSlice/uploadSong',
    async (uploadSongPayload, { rejectWithValue }) => {
        try {
            const { data } = await songsService.uploadSong(uploadSongPayload);
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });

const getGenres = createAsyncThunk<IGenre[]>('songsSlice/getGenres',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await songsService.getGenres();
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });

const createCollection = createAsyncThunk<IBasicResponse, ICreateSongCollection>('songsSlice/createCollection',
    async (payload, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await songsService.createCollection(payload);
            await dispatch(getMyCollections());
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });
const deleteCollection = createAsyncThunk<IBasicResponse, number>('songsSlice/deleteCollection',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await songsService.removeCollection(id);
            await dispatch(getMyCollections());
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });
const addToCollection = createAsyncThunk<IBasicResponse, IUpdateCollection>('songsSlice/addToCollection',
    async (payload, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await songsService.addSongToCollection(payload);
            await dispatch(getMyCollections());
            return data;
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });

const registerListening = createAsyncThunk<any, number>('songsSlice/registerListening',
    async (songId, { rejectWithValue }) => {
        try {
            await songsService.postSongListened(songId);
        } catch (e) {
            const { response } = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    });

interface IState extends ICommonState {
    songs: ISong[];
    songDetails: ISongDetails | null;
    genres: IGenre[];
    responseMessage: string | null;
    pagesCount: number;
    loading: boolean;
    collections: ISongsCollection[];
    searchSuggestions: string[];
    searchResult: ISong[];
    searchResultPages: number;
}

const initialState: IState = {
    errors: null,
    songs: [],
    collections: [],
    songDetails: null,
    genres: [],
    responseMessage: null,
    pagesCount: 0,
    loading: false,
    searchSuggestions: [],
    searchResult: [],
    searchResultPages: 0
}

type SongDetailsProperty<K extends keyof ISongDetails> = {
    key: K,
    value: ISongDetails[K]
};

const songsSlice = createSlice({
    name: 'songsSlice',
    initialState,
    reducers: {
        setErrors: setErrorsFunc,
        setResponseMessage: setResponseMessageFunc,
        clearSongs: (state) => {
            state.songs = [];
        },
        clearCollections: (state) => {
            state.collections = [];
        },
        clearSearchResult: (state) => {
            state.searchResult = [];
        },
        setSongStatistics: (state, action: PayloadAction<ISongStatistics>) => {
            state.songDetails = { ...state.songDetails!, ...action.payload }
        },
        setSong: (state, action: PayloadAction<ISongDetails | null>) => {
            state.songDetails = { ...state.songDetails!, ...action.payload };
        },
        setSongProperty: (state: IState, action: PayloadAction<SongDetailsProperty<keyof ISongDetails>>) => {
            const {key, value} = action.payload;
            if (!state.songDetails) return; 
            ((state.songDetails as unknown) as Record<string, unknown>)[key] = value;
        },
        clearSongDetails: (state) => {
            state.songDetails = null;
        }
    },
    extraReducers: builder => builder
        // .addCase(loadMoreSongs.rejected, (state, action) => {
        //     state.errors = action.payload as string;
        // })
        // .addCase(loadMoreSongs.fulfilled, (state, action) => {
        //     state.songs = [...state.songs, ...action.payload.songs];
        //     state.pagesCount = action.payload.pagesCount;
        //     state.errors = null;
        // })
        .addCase(getSongsList.fulfilled, (state, action) => {
            const key = action.meta.arg.key;
            if (!!key) {
                state.searchResult = action.payload.songs;
                state.searchResultPages = action.payload.pagesCount;
            }
            else {
                state.songs = action.payload.songs;
                state.pagesCount = action.payload.pagesCount;
            }
            state.errors = null;
        })
        .addCase(getSongsList.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(getSongById.fulfilled, (state, action) => {
            state.songDetails = action.payload;
            state.errors = null;
            state.loading = false;
        })
        .addCase(getSongById.pending, (state, action) => {
            state.loading = true;
        }).addCase(getSongById.rejected, (state, action) => {
            state.errors = action.payload as string;
            state.loading = false;
        })
        .addCase(uploadSong.fulfilled, (state, action) => {
            state.responseMessage = action.payload.message;
            state.errors = null;
            state.errors = null;
            state.loading = false;
        })
        .addCase(uploadSong.pending, state => {
            state.loading = true;
        })
        .addCase(uploadSong.rejected, (state, action) => {
            state.errors = action.payload as string;
            state.loading = false;
        })
        .addCase(getMyCollections.fulfilled, (state, action) => {
            state.collections = action.payload.collections;
            state.errors = null;
            state.loading = false;
        })
        .addCase(getMyCollections.pending, state => {
            state.loading = true;
        })
        .addCase(getMyCollections.rejected, (state, action) => {
            state.errors = action.payload as string;
            state.loading = false;
        })
        .addCase(getCollectionSongs.fulfilled, (state, action) => {
            state.songs = action.payload.songs;
            state.errors = null;
            state.loading = false;
        })
        .addCase(getCollectionSongs.pending, state => {
            state.loading = true;
        })
        .addCase(getCollectionSongs.rejected, (state, action) => {
            state.errors = action.payload as string;
            state.loading = false;
        })
        .addCase(getGenres.fulfilled, (state, action) => {
            state.genres = action.payload;
            state.errors = null;
        })
        .addCase(getGenres.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(createCollection.fulfilled, (state, action) => {
            state.responseMessage = action.payload.message;
            state.errors = null;
        })
        .addCase(createCollection.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(deleteCollection.fulfilled, (state, action) => {
            state.responseMessage = action.payload.message;
            state.errors = null;
        })
        .addCase(deleteCollection.rejected, (state, action) => {
            state.errors = action.payload as string;
        }).addCase(addToCollection.fulfilled, (state, action) => {
            state.responseMessage = action.payload.message;
            state.errors = null;
        })
        .addCase(addToCollection.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(getSongSearchSuggestions.fulfilled, (state, action) => {
            state.searchSuggestions = action.payload.titles;
            state.loading = false;
            state.errors = null;
        })
        .addCase(getSongSearchSuggestions.rejected, (state, action) => {
            state.errors = action.payload as string;
            state.loading = false;
            state.searchSuggestions = [];
        })
        .addCase(registerListening.fulfilled, () => {
        })
        .addCase(registerListening.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
});

const { reducer: songsReducer, actions } = songsSlice;
const { clearSongDetails, setSong, setErrors, setResponseMessage, clearSongs, setSongStatistics, clearSearchResult, clearCollections } = actions;

const songsActions = {
    getSongsList,
    getSongById,
    uploadSong,
    getGenres,
    setErrors,
    setResponseMessage,
    getMyCollections,
    clearSongs,
    getCollectionSongs,
    createCollection,
    deleteCollection,
    addToCollection,
    setSongStatistics,
    getSongSearchSuggestions,
    registerListening,
    clearSearchResult,
    clearCollections,
    setSong,
    clearSongDetails
}
export {
    songsReducer,
    songsActions,
}