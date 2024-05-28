import React, {useEffect, useState} from 'react';
import {IUserData, IBasicResponse} from "../../interfaces";
import {authService} from "../../services";
import {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";
import {Profile} from "../../components";

export const MeInfoPage = () => {
    // const [user, setUser] = useState<IAuthUser | null>(null);
    // const [errors, setErrors] = useState<string>('');
    // const navigate = useNavigate();
    // useEffect(() => {
    //     authService.me().then(({data}) => setUser(data)).catch(e => {
    //         const {response} = e as AxiosError<IBasicResponse>;
    //         if (!response || response!.status === 401) return navigate('/login');
    //         setErrors(response!.data.message);
    //     });
    // }, [navigate]);
    return (
        <Profile/>
        // <div>
        //     {user && <div>
        //         <p>Username: {user.userName}</p>
        //         <p>Email: {user.email}</p>
        //     </div>}
        //     {errors && <div>{errors}</div>}
        // </div>
    );
};