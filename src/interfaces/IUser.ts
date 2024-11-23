import { ILink } from "./ILink.js";

export interface IUser {
    id?: string,
    nome: string,
    email: string,
    senha: string,
    created_at: Date,
    removed_at: null | Date,
    links: ILink[]
}