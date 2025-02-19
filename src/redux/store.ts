import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { songsReducer } from "./slices/songsSlice";
import { playerReducer } from "./slices/playerSlice";
import { statisticsReducer } from "./slices/statisticsSlice";
import { commonReducer } from "./slices/commonSlice";


const rootReducer = combineReducers({
    authReducer,
    songsReducer,
    playerReducer,
    statisticsReducer,
    commonReducer
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