import {LoadManifestResponse, ManifestEntryResponse, WorkTicket} from "../../types";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {selectCurrentSaving, selectManifestLoading} from "./selectors";
import dayjs from "dayjs";
import {
    deleteManifestEntry,
    fetchManifestEntries,
    fetchManifestEntry,
    fetchWorkTicket,
    postManifestEntry
} from "../../api/manifest";
import {SortProps} from "chums-components";
import {PMManifestEntry, PMManifestEntryItem} from "chums-types";

export const setCurrentEntry = createAction<PMManifestEntry>('manifest/current/setEntry');

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

export const saveManifestEntry = createAsyncThunk<LoadManifestResponse, PMManifestEntry>(
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

export const removeManifestEntry = createAsyncThunk<LoadManifestResponse, PMManifestEntry>(
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

export const loadWorkTicket = createAsyncThunk<WorkTicket | null, string>(
    'manifest/current/loadWorkTicket',
    async (arg) => {
        return await fetchWorkTicket(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !selectManifestLoading(state) && !selectCurrentSaving(state);
        }
    }
)

export const updateCurrentEntry = createAction<Partial<Omit<PMManifestEntry, 'id'>>>('manifest/current/update');
export const setNewEntry = createAction('manifest/current/newEntry');
export const setListFilter = createAction<string>('manifest/list/setFilter');
export const setListSort = createAction<SortProps<PMManifestEntryItem>>('manifest/list/setHistorySort');
