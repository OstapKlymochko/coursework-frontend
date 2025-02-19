export interface IEndpoints {
    auth: {
        login: string,
        register: string,
        refresh: string,
        me: string;
        requestPasswordReset: string;
        resetPassword: string;
        update: string;
        confirm: string;
        avatar: string;
    },
    roles: {
        roles: string
    },
    songs: {
        get: string;
        getSuggestions: string;
        create: string;
        genres: string;
        collections: string;
        addSongToCollection: string;
        removeSongFromCollection: string;
        views: string;
    },
    statistics: {
        reaction: string;
        comments: string
    }
}