export interface IUserData {
    id: number,
    email: string,
    userName: string;
    firstName: string | null;
    lastName: string | null;
    roles: string[] | null;
    avatarUrl: string | null;
}