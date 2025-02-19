import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks";
import {useNavigate, useSearchParams} from "react-router-dom";
import {authActions} from "../../redux";
import {InfoPopup} from "../InfoPopup/InfoPopup";

export const ConfirmEmail = () => {
    const [params] = useSearchParams();
    const {email = null, token = null} = {email: params.get('email'), token: params.get('token')}
    const {errors, responseMessage} = useAppSelector(s => s.authReducer);
    const {confirmEmail, setErrors, setResponseMessage} = authActions;
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
   
    useEffect(() => {
        if (!email || !token) {
            dispatch(setErrors('Email and token must be provided'));
            return;
        }
        dispatch(confirmEmail({email, token: token.replaceAll(' ', '+')})).unwrap()
            .then(() => navigate('/songs')).catch(()=>{});
    }, [email, token, dispatch, setErrors, confirmEmail, navigate])

    return (
        <>
            {responseMessage && <InfoPopup severity={'info'} content={responseMessage} open={!!responseMessage}
                                           setOpen={(value) => dispatch(setResponseMessage(value))}/>}
            {errors && <InfoPopup severity={'error'} content={errors} open={!!errors}
                                  setOpen={(value) => dispatch(setErrors(value))}/>}
        </>
    );
};