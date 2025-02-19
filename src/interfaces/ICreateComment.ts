export interface ICreateComment {
    songId: number;
    body: string;
    repliedTo?: number | null;
    id?: number | null;
    userName: string;
}