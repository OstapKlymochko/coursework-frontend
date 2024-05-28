import {AnyAsyncThunk, RejectedWithValueActionFromAsyncThunk} from "@reduxjs/toolkit/dist/matchers";
import {AxiosError} from "axios";
import {IBasicResponse} from "../../interfaces";

export const handleDefaultError = (e: unknown, rejectWithValue: RejectedWithValueActionFromAsyncThunk<AnyAsyncThunk>) => {
    const {response} = e as AxiosError<IBasicResponse>;
    return rejectWithValue(response!.data.message);
}