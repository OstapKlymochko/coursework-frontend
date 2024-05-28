export interface IUploadSong {
    title: string | null;
    genreId: number | null;
    song: File | null;
    logo?: File | null;
    videoClip?: File | null;
}