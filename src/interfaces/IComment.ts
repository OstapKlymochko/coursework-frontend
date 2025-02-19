export interface IComment {
    id: number;
    userId: number;
    songId: number;
    userName: string;
    body: string;
    edited: boolean;
    attached: boolean;
    createdAt: Date;
    repliesCount?: number;
    replies?: IComment[];
    avatarFileKey: string | null;
}