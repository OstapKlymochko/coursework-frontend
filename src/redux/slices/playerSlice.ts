import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

import {ICommonState} from "../common/ICommonState";
import {IBasicResponse, ISong, ISongDetails, ISongStatistics} from "../../interfaces";
import {ITrackList} from "../../interfaces/ITrackList";
import {songsService} from "../../services";
import {AxiosError} from "axios";

interface IState extends ICommonState {
    currSong: ISongDetails | null;
    loading: boolean;
    isPlaying: boolean;
    volume: number;
    trackList: ITrackList;
}

const initialState: IState = {
    currSong: null,
    isPlaying: false,
    errors: null,
    responseMessage: null,
    loading: false,
    volume: 0.5,
    trackList: {id: -1, songs: []}
}

const getSongsStatistics = createAsyncThunk<ISongStatistics, number>('playerSlice/getSongsStatistics',
    async (songId, {rejectWithValue}) => {
        try {
            const {data} = await songsService.getSongStatistics(songId);
            return data;
        } catch (e) {
            const {response} = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message);
        }
    })

const playerSlice = createSlice({
    name: 'playerSlice',
    initialState,
    reducers: {
        setSong: (state: IState, action: PayloadAction<ISongDetails | null>) => {
            state.currSong = action.payload;
        },
        pause: (state: IState) => {
            state.isPlaying = false
        },
        play: (state: IState) => {
            state.isPlaying = true
        },
        toggleIsPlaying: (state: IState) => {
            if (!!state.currSong) state.isPlaying = !state.isPlaying;
        },
        setVolume: (state: IState, action: PayloadAction<number>) => {
            const value = action.payload;
            if (value < 0 || value > 1) return;
            state.volume = value;
        },
        setTrackList: (state: IState, action: PayloadAction<ITrackList>) => {
            state.trackList = action.payload;
        },
        setTrackListSongs: (state: IState, action: PayloadAction<ISong[]>) => {
            state.trackList.songs = action.payload;
        }
    },
    extraReducers: builder => builder
        .addCase(getSongsStatistics.fulfilled, (state, action) => {
            state.currSong = {...state.currSong!, ...action.payload}
            state.loading = false;
            state.errors = null;
        })
        .addCase(getSongsStatistics.pending, (state) => {
            state.loading = true;
        })
        .addCase(getSongsStatistics.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
});

const {reducer: playerReducer, actions} = playerSlice;
const {setTrackListSongs, setTrackList, setVolume, toggleIsPlaying, setSong, pause, play} = actions;

const playerActions = {
    setSong,
    pause,
    toggleIsPlaying,
    play,
    setVolume,
    setTrackList,
    setTrackListSongs,
    getSongsStatistics
}

export {
    playerReducer,
    playerActions,
}