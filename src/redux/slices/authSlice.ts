import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IBasicResponse, ILogin, ITokenPair, IUserData} from "../../interfaces";
import {authService} from "../../services";
import {AxiosError} from "axios";
import {ICommonState} from "../common/ICommonState";
import {IConfirmEmail} from "../../interfaces/IConfirmEmail";
import {
    setErrors as setErrorsFunc,
    setResponseMessage as setResponseMessageFunc
} from "../common/defaultSetStateActions";
import {handleDefaultError} from "../common/handleDefaultError";

const login = createAsyncThunk<ITokenPair, ILogin>('authSlice/login',
    async (loginPayload, {rejectWithValue}) => {
        try {
            const response = await authService.login(loginPayload);
            return response.data;
        } catch (e) {
            const {response} = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message)
        }
    });

const getMyData = createAsyncThunk<IUserData>('authSlice/getMyData',
    async (_, {rejectWithValue}) => {
        try {
            const {data} = await authService.me();
            return data;
        } catch (e) {
            const {response} = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message)
        }
    });

const updateUser = createAsyncThunk<IBasicResponse, IUserData>('authSlice/updateUser',
    async (updateData, {rejectWithValue, dispatch}) => {
        try {
            const {data} = await authService.updateUser(updateData);
            await dispatch(getMyData());
            return data;
        } catch (e) {
            return handleDefaultError(e, rejectWithValue);
        }
    })

const confirmEmail = createAsyncThunk<IBasicResponse, IConfirmEmail>('authSlice/confirmEmail',
    async (confirmEmailPayload, {rejectWithValue}) => {
        try {
            const {data} = await authService.confirmEmail(confirmEmailPayload);
            return data;
        } catch (e) {
            const {response} = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message)
        }
    });

const uploadAvatar = createAsyncThunk<IBasicResponse, FormData>('authSlice/uploadAvatar',
    async (payload, {rejectWithValue, dispatch}) => {
        try {
            const {data} = await authService.uploadAvatar(payload);
            dispatch(getMyData());
            return data;
        } catch (e) {
            const {response} = e as AxiosError<IBasicResponse>;
            return rejectWithValue(response!.data.message)
        }
    })

interface IState extends ICommonState {
    user: IUserData | null;
    responseMessage: string | null;
    isAuthorized: boolean;
}

const initialState: IState = {
    user: null,
    errors: null,
    responseMessage: null,
    isAuthorized: authService.isAuthorized()
};

const authSlice = createSlice({
    initialState,
    name: 'authSlice',
    reducers: {
        setErrors: setErrorsFunc,
        setResponseMessage: setResponseMessageFunc,
        logout: (state) => {
            authService.deleteTokens();
            state.isAuthorized = false;
            state.user = null;
        },
        setUser: (state: IState, action: PayloadAction<IUserData>) => {
            state.user = action.payload;
        },
    },
    extraReducers: builder => builder
        .addCase(login.fulfilled, (state, action) => {
            state.errors = null;
            state.isAuthorized = true;
        })
        .addCase(login.rejected, (state, action) => {
            state.errors = action.payload as string;
            state.isAuthorized = false;
        })
        .addCase(getMyData.fulfilled, (state, action) => {
            state.user = action.payload;
            state.errors = null;
        })
        .addCase(getMyData.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(confirmEmail.fulfilled, (state, action) => {
            state.responseMessage = action.payload.message;
            state.errors = null;
        })
        .addCase(confirmEmail.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.responseMessage = action.payload.message;
            state.errors = null;
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(uploadAvatar.rejected, (state, action) => {
            state.errors = action.payload as string;
        })
        .addCase(uploadAvatar.fulfilled, (state, action) => {
            state.responseMessage = action.payload.message;
            state.errors = null;
        })
});


const {reducer: authReducer, actions} = authSlice;
const {setErrors, setResponseMessage, logout, setUser} = actions;

const authActions = {
    login,
    getMyData,
    confirmEmail,
    setErrors,
    setResponseMessage,
    logout,
    setUser,
    updateUser,
    uploadAvatar
}

export {
    authReducer,
    authActions
}