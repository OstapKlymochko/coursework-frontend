import {PayloadAction} from "@reduxjs/toolkit";
import {ICommonState} from "./ICommonState";

const setErrors = <T extends ICommonState, >(state: T, action: PayloadAction<string | null>): void => {
    state.errors = action.payload
}

const setResponseMessage = <T extends ICommonState, >(state: T, action: PayloadAction<string | null>): void => {
    state.responseMessage = action.payload
}


export {
    setErrors,
    setResponseMessage
}