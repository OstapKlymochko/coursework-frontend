import {IEndpoints} from "../interfaces";

const baseURL = 'http://localhost:5000/apigateway';

const users = '/users';
const auth = '/auth';
const login = `${auth}/login`;
const register = `${auth}/register`;
const refresh = `${auth}/refresh`;
const me = `${users}/me`;
const roles = `${auth}/role`;
const requestPasswordReset = `${auth}/resetPasswordRequest`;
const resetPassword = `${auth}/reset`;
const update = `${users}/update`;
const confirmEmail = `${auth}/confirm`

const files = '/files';
const avatar = '/avatar';
const songs = '/songs';
const get = `${songs}/get`;
const getSuggestions = get + '-suggestions';
const genres = `${songs}/genres`;
const collections = `${songs}/collections`;
const addSongToCollection = collections + '/add-song';
const removeSongFromCollection = collections + '/remove-song';
const statistics = `${songs}/statistics`
const reaction = `${statistics}/reaction`;
const comments = `${statistics}/comments`;
const views = `${statistics}/views`;

const urls: IEndpoints = {
    auth: {
        login,
        register,
        refresh,
        me,
        requestPasswordReset,
        resetPassword,
        update,
        confirm: confirmEmail,
        avatar: files + avatar
    },
    roles: {
        roles
    },
    songs: {
        get,
        create: files + '/song',
        genres,
        collections,
        addSongToCollection,
        removeSongFromCollection,
        getSuggestions,
        views,
    },
    statistics: {
        reaction,
        comments
    }
}

export {
    baseURL,
    urls
}