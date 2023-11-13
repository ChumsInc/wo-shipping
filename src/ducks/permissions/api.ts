import {fetchJSON} from "chums-components";

export interface ValidateRoleResponse {
    id: number;
    success: boolean;
}
export async function validateRole(role:string):Promise<boolean> {
    try {
        const url = `/api/user/validate/role/${encodeURIComponent(role)}`;
        const res = await fetchJSON<ValidateRoleResponse>(url, {cache: 'no-cache', credentials: "same-origin"});
        return res?.success === true;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("validateRole()", err.message);
            return Promise.reject(err);
        }
        console.debug("validateRole()", err);
        return Promise.reject(new Error('Error in validateRole()'));
    }
}


export interface UserValidationResponse {
    canEntry: boolean;
    canEdit: boolean;
}
export async function validateUser():Promise<UserValidationResponse> {
    try {
        const canEntry = await validateRole('production');
        const canEdit = await validateRole('inventory_admin');
        return {canEntry, canEdit};
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("validateUser()", err.message);
            return Promise.reject(err);
        }
        console.debug("validateUser()", err);
        return Promise.reject(new Error('Error in validateUser()'));
    }
}
