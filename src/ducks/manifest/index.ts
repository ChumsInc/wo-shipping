import {ManifestEntry, WorkOrder} from "../../types";
import {SortProps} from "chums-components";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadManifestEntries,
    loadManifestEntry,
    loadWorkOrder,
    removeManifestEntry,
    saveManifestEntry,
    setCurrentEntry, setListFilter, setListSort, updateCurrentEntry
} from "./actions";
import {manifestSorter} from "./utils";
import {Editable} from "chums-types/src/generics";
import LocalStore, {CURRENT_DATE} from "../../LocalStore";
import {setCurrentShipDate} from "../shipDates";


export interface ManifestState {
    shipDate: string|null;
    list: {
        entries: ManifestEntry[];
        loading: boolean;
        loaded: boolean;
        sort: SortProps<ManifestEntry>;
        filter: string;
    }
    current: {
        entry: (ManifestEntry & Editable);
        workOrder: WorkOrder|null;
        loading: boolean;
        saving: boolean;
    };
}

export const newEntry: ManifestEntry = {
    id: 0,
    Company: 'chums',
    ShipDate: '',
    QuantityShipped: 0,
    QuantityOrdered: 0,
    WorkOrderNo: '',
}

export const defaultSort: SortProps<ManifestEntry> = {field: 'id', ascending: false};


export const initialManifestState: ManifestState = {
    shipDate: LocalStore.getItem<string|null>(CURRENT_DATE, null) ?? null,
    list: {
        entries: [],
        loading: false,
        loaded: false,
        sort: {...defaultSort},
        filter: ''
    },
    current: {
        entry: {...newEntry},
        workOrder: null,
        loading: false,
        saving: false,
    },
}

const manifestReducer = createReducer(initialManifestState, builder => {
    builder
        .addCase(loadManifestEntries.pending, (state, action) => {
            state.list.loading = true;
        })
        .addCase(loadManifestEntries.fulfilled, (state, action) => {
            state.list.loading = false;
            state.list.loaded = true;
            state.list.entries = action.payload.list.sort(manifestSorter(defaultSort));
        })
        .addCase(loadManifestEntries.rejected, (state) => {
            state.list.loading = false;
        })
        .addCase(saveManifestEntry.pending, (state) => {
            state.current.saving = true;
        })
        .addCase(saveManifestEntry.fulfilled, (state, action) => {
            state.current.saving = false;
            state.list.loaded = true;
            state.list.entries = action.payload.list.sort(manifestSorter(defaultSort));
            if (state.shipDate) {
                state.current.entry = {...newEntry, ShipDate: state.shipDate}
            }
        })
        .addCase(saveManifestEntry.rejected, (state) => {
            state.current.saving = false;
        })
        .addCase(removeManifestEntry.pending, (state) => {
            state.current.saving = true;
        })
        .addCase(removeManifestEntry.fulfilled, (state, action) => {
            state.current.saving = false;
            state.list.loaded = true;
            state.list.entries = action.payload.list.sort(manifestSorter(defaultSort));
            if (state.shipDate) {
                state.current.entry = {...newEntry, ShipDate: state.shipDate}
            }
        })
        .addCase(removeManifestEntry.rejected, (state) => {
            state.current.saving = false;
        })
        .addCase(loadManifestEntry.pending, (state) => {
            state.current.loading = true;
        })
        .addCase(loadManifestEntry.fulfilled, (state, action) => {
            state.current.loading = false;
            state.current.entry= action.payload?.entry ?? newEntry;
            state.current.workOrder = action.payload?.workOrder ?? null;
        })
        .addCase(loadManifestEntry.rejected, (state) => {
            state.current.loading = false;
        })
        .addCase(setCurrentEntry, (state, action) => {
            state.current.entry = action.payload;
        })
        .addCase(loadWorkOrder.pending, (state) => {
            state.current.loading = true;
        })
        .addCase(loadWorkOrder.fulfilled, (state, action) => {
            state.current.loading = false;
            state.current.workOrder = action.payload;
        })
        .addCase(loadWorkOrder.rejected, (state) => {
            state.current.loading = false;
        })
        .addCase(updateCurrentEntry, (state, action) => {
            state.current.entry = {...state.current.entry, ...action.payload, changed: true};
        })
        .addCase(setCurrentShipDate, (state, action) => {
            state.shipDate = action.payload;
        })
        .addCase(setListFilter, (state, action) => {
            state.list.filter = action.payload;
        })
        .addCase(setListSort, (state, action) => {
            state.list.sort = action.payload;
        })

});

export default manifestReducer;
