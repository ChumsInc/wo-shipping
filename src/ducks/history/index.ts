import {WOManifestEntryItem} from "chums-types/src/work-order";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {Editable} from "chums-types/src/generics";
import {RootState} from "../../app/configureStore";
import {SortProps} from "chums-components";
import {fetchManifestEntrySearch} from "../../api/manifest";
import {manifestSorter, totalsReducer} from "../manifest/utils";
import {PMManifestEntryItem} from "chums-types/src/production";

export interface HistorySearch {
    workTicketNo: string;
    warehouseCode: string;
    itemCode: string;
    salesOrderNo: string;
    fromDate: string;
    toDate: string;
    shipDate: string;
}

export interface HistoryState {
    list: PMManifestEntryItem[];
    loading: boolean;
    loaded: boolean;
    search: HistorySearch & Editable;
    sort: SortProps<PMManifestEntryItem>
}

export const initialState: HistoryState = {
    list: [],
    loading: false,
    loaded: false,
    search: {
        workTicketNo: '',
        warehouseCode: '',
        itemCode: '',
        salesOrderNo: '',
        fromDate: '',
        toDate: '',
        shipDate: '',
        changed: false
    },
    sort: {field: 'id', ascending: false},
}

export const selectHistoryList = (state: RootState) => state.history.list;
export const selectSearchLoading = (state: RootState) => state.history.loading;
export const selectSearchLoaded = (state: RootState) => state.history.loaded;
export const selectSearchParams = (state: RootState) => state.history.search;
export const selectHistorySort = (state: RootState) => state.history.sort;

export const selectSortedHistoryList = createSelector(
    [selectHistoryList, selectHistorySort],
    (list, sort) => {
        return [...list].sort(manifestSorter(sort));
    }
)

export const selectHistoryTotals = createSelector(
    [selectHistoryList],
    (list) => {
        return totalsReducer(list, 'Lookup Total');
    }

)

export const setSearch = createAction<Partial<HistorySearch>>('history/setSearch');
export const setHistorySort = createAction<SortProps<PMManifestEntryItem>>('history/setSort');
export const loadSearch = createAsyncThunk<PMManifestEntryItem[], HistorySearch>(
    'history/load',
    async (arg) => {
        return await fetchManifestEntrySearch(arg)
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectSearchLoading(state);
        }
    }
)

const historyReducer = createReducer(initialState, builder => {
    builder
        .addCase(loadSearch.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadSearch.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.search.changed = false;
            state.list = action.payload.sort(manifestSorter(initialState.sort));
        })
        .addCase(loadSearch.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setSearch, (state, action) => {
            state.search = {...state.search, ...action.payload, changed: true};
        })
        .addCase(setHistorySort, (state, action) => {
            state.sort = action.payload;
        })
})

export default historyReducer;
