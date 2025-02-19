import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
    mode: 'light' | 'dark'
}

const initialState: IState = {
    mode: 'light'
}

const commonSlice = createSlice({
    name: 'commonSlice',
    initialState,
    reducers: {
        toggleTheme: (state: IState) => {
            if (state.mode === 'light') state.mode = 'dark';
            else if (state.mode === 'dark') state.mode = 'light';
            localStorage.setItem('mode', state.mode);
        },
        setMode: (state: IState, { payload }: PayloadAction<'light' | 'dark'>) => {
            state.mode = payload;
            localStorage.setItem('mode', payload);
        }
    }
});

const { reducer: commonReducer, actions } = commonSlice;
const { toggleTheme, setMode } = actions;

const commonActions = {
    toggleTheme,
    setMode
}

export {
    commonReducer,
    commonActions
}