import {LoadManifestResponse, ManifestEntry, ManifestEntryResponse, WorkOrder} from "../../types";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {selectCurrentSaving, selectManifestLoading} from "./selectors";
import dayjs from "dayjs";
import {
    deleteManifestEntry,
    fetchManifestEntries,
    fetchManifestEntry,
    fetchWorkOrder,
    postManifestEntry
} from "../../api/manifest";
import {SortProps} from "chums-components";

export const setCurrentEntry = createAction<ManifestEntry>('manifest/current/setEntry');

export const loadManifestEntries = createAsyncThunk<LoadManifestResponse, string>(
    'manifest/list/load',
    async (arg) => {
        return await fetchManifestEntries(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return dayjs(arg).isValid() && !selectManifestLoading(state);
        }
    }
)

export const saveManifestEntry = createAsyncThunk<LoadManifestResponse, ManifestEntry>(
    'manifest/current/save',
    async (arg) => {
        return await postManifestEntry(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return dayjs(arg.ShipDate).isValid() && !selectManifestLoading(state) && !selectCurrentSaving(state);
        }
    }
)

export const removeManifestEntry = createAsyncThunk<LoadManifestResponse, ManifestEntry>(
    'manifest/current/remove',
    async (arg) => {
        return await deleteManifestEntry(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.id && !selectManifestLoading(state) && !selectCurrentSaving(state);
        }
    }
)

export const loadManifestEntry = createAsyncThunk<ManifestEntryResponse | null, number>(
    'manifest/current/load',
    async (arg) => {
        return await fetchManifestEntry(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !selectManifestLoading(state) && !selectCurrentSaving(state);
        }
    }
)

export const loadWorkOrder = createAsyncThunk<WorkOrder | null, string>(
    'manifest/current/loadWorkOrder',
    async (arg) => {
        return await fetchWorkOrder(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !selectManifestLoading(state) && !selectCurrentSaving(state);
        }
    }
)

export const updateCurrentEntry = createAction<Partial<Omit<ManifestEntry, 'id'>>>('manifest/current/update');
export const setListFilter = createAction<string>('manifest/list/setFilter');
export const setListSort = createAction<SortProps<ManifestEntry>>('manifest/list/setSort');
