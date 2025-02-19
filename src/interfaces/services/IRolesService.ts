import {IRole} from "../IRole";
import {IRes} from "../../services";

export interface IRolesService {
    getAll: () => IRes<IRole[]>,
    getById: (id: number) => IRes<IRole>
}