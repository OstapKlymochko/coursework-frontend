import {IRolesService} from "../interfaces";
import {apiService} from "./apiService";
import {urls} from "../configs";


export const rolesService: IRolesService = {
    getAll: () => apiService.get(urls.roles.roles),
    getById: (id) => apiService.get(urls.roles.roles + `/${id}`)
}