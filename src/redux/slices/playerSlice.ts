import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ICommonState } from "../common/ICommonState";
import { IBasicResponse, ISong, ISongDetails, ISongStatistics } from "../../interfaces";
import { ITrackList } from "../../interfaces/ITrackList";
import { songsService } from "../../services";
import { AxiosError } from "axios";

interface IState extends ICommonState {
    loading: boolean;
    isPlaying: boolean;
    volume: number;
    trackList: ITrackList;
    currListenTime: number;
}

const initialState: IState = {
    isPlaying: false,
    errors: null,
    responseMessage: null,
    loading: false,
    volume: 0.5,
    trackList: { id: -1, songs: [] },
    currListenTime: 0
}

const playerSlice = createSlice({
    name: 'playerSlice',
    initialState,
    reducers: {
        // setSong: (state: IState, action: PayloadAction<ISongDetails | null>) => {
        //     state.currSong = action.payload;
        // },
        pause: (state: IState) => {
            state.isPlaying = false
        },
        play: (state: IState) => {
            state.isPlaying = true
        },
        toggleIsPlaying: (state: IState) => {
            state.isPlaying = !state.isPlaying;
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
        },
        setCurrTime: (state: IState, action: PayloadAction<number>) => {
            state.currListenTime = action.payload;
        }
    }        
});

const { reducer: playerReducer, actions } = playerSlice;
const { setCurrTime, setTrackListSongs, setTrackList, setVolume, toggleIsPlaying, pause, play } = actions;

const playerActions = {
    pause,
    toggleIsPlaying,
    play,
    setVolume,
    setTrackList,
    setTrackListSongs,
    setCurrTime
}

export {
    playerReducer,
    playerActions,
}
