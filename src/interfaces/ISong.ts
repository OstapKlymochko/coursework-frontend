import {IUserData} from "./IUserData";

export type IAuthor = Pick<IUserData, 'firstName' | 'lastName' | 'id'>

export interface ISong {
    id: number;
    title: string;
    genre: string;
    logoUrl: string;
    authorId: number;
    authorPseudonym: string;
}