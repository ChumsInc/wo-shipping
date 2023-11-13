import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {UserValidationResponse, validateUser} from "./api";
import {RootState} from "../../app/configureStore";

export interface PermissionsState {
    canEntry: boolean|null;
    canEdit: boolean|null;
    loading: boolean;
}

export const initialState:PermissionsState = {
    canEntry: null,
    canEdit: null,
    loading: false,
}

export const selectCanEnter = (state:RootState) => state.permissions.canEntry;
export const selectCanEdit = (state:RootState) => state.permissions.canEdit;
export const selectPermissionsLoading = (state:RootState) => state.permissions.loading;

export const loadPermissions = createAsyncThunk<UserValidationResponse>(
    'permissions/checkEntry',
    async () => {
        return await validateUser();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectPermissionsLoading(state);
        }
    }
)

const permissionsReducer = createReducer(initialState, builder => {
    builder
        .addCase(loadPermissions.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadPermissions.fulfilled, (state, action) => {
            state.canEntry = action.payload.canEntry ?? null;
            state.canEdit = action.payload.canEdit ?? null;
            state.loading = false;
        })
        .addCase(loadPermissions.rejected, (state) => {
            state.canEdit = null;
            state.canEntry = null;
            state.loading = false;
        })
});

export default permissionsReducer;
