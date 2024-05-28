import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {authReducer} from "./slices/authSlice";
import {songsReducer} from "./slices/songsSlice";
import {playerReducer} from "./slices/playerSlice";
import {statisticsReducer} from "./slices/statisticsSlice";


const rootReducer = combineReducers({
    authReducer,
    songsReducer,
    playerReducer,
    statisticsReducer
});

const setUpStore = () => configureStore({
    reducer: rootReducer
});

type RootState = ReturnType<typeof rootReducer>;
type AppStore = ReturnType<typeof setUpStore>;
type AppDispatch = AppStore['dispatch'];

export type {
    RootState,
    AppDispatch,
    AppStore
}
export {
    setUpStore
}