import {WorkOrder} from "../../types";
import {SortProps} from "chums-components";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadManifestEntries,
    loadManifestEntry,
    loadWorkOrder,
    removeManifestEntry,
    saveManifestEntry,
    setCurrentEntry,
    setListFilter,
    setListSort, setNewEntry,
    updateCurrentEntry
} from "./actions";
import {manifestSorter} from "./utils";
import {Editable} from "chums-types/src/generics";
import LocalStore, {CURRENT_DATE} from "../../LocalStore";
import {setCurrentShipDate} from "../shipDates";
import {WOManifestEntry} from "chums-types/src/work-order";
import {WOManifestEntryItem} from "chums-types";


export interface ManifestState {
    shipDate: string | null;
    list: {
        entries: WOManifestEntryItem[];
        loading: boolean;
        loaded: boolean;
        sort: SortProps<WOManifestEntryItem>;
        filter: string;
    }
    current: {
        entry: (WOManifestEntry & Editable);
        workOrder: WorkOrder | null;
        loading: boolean;
        saving: boolean;
    };
}

export const newEntry = (): WOManifestEntry => {
    const shipDate = LocalStore.getItem<string | null>(CURRENT_DATE, null) ?? null;
    return {
        id: 0,
        Company: 'chums',
        ShipDate: shipDate ?? '',
        QuantityShipped: 0,
        WorkOrderNo: '',
        ItemCode: '',
        WarehouseCode: '',
        Comment: '',
    }
}
export const defaultSort: SortProps<WOManifestEntryItem> = {field: 'id', ascending: false};


export const initialManifestState: ManifestState = {
    shipDate: LocalStore.getItem<string | null>(CURRENT_DATE, null) ?? null,
    list: {
        entries: [],
        loading: false,
        loaded: false,
        sort: {...defaultSort},
        filter: ''
    },
    current: {
        entry: {...newEntry()},
        workOrder: null,
        loading: false,
        saving: false,
    },
}

const manifestReducer = createReducer(initialManifestState, builder => {
    builder
        .addCase(loadManifestEntries.pending, (state) => {
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
                state.current.entry = {...newEntry(), ShipDate: state.shipDate}
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
                state.current.entry = {...newEntry(), ShipDate: state.shipDate}
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
            state.current.entry = action.payload?.entry ?? newEntry();
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
            state.current.entry.ItemCode = action.payload?.ItemBillNumber ?? null;
            state.current.entry.WarehouseCode = action.payload?.ParentWhse ?? null;
        })
        .addCase(loadWorkOrder.rejected, (state) => {
            state.current.loading = false;
        })
        .addCase(updateCurrentEntry, (state, action) => {
            state.current.entry = {...state.current.entry, ...action.payload, changed: true};
        })
        .addCase(setCurrentShipDate, (state, action) => {
            if (action.payload !== state.shipDate) {
                state.list.entries = [];
                state.current.entry = {...newEntry(), ShipDate: action.payload ?? ''};
            }
            state.shipDate = action.payload;
            if (action.payload && !state.current.entry.id) {
                state.current.entry = {...newEntry(), ShipDate: action.payload};
            }
        })
        .addCase(setListFilter, (state, action) => {
            state.list.filter = action.payload;
        })
        .addCase(setListSort, (state, action) => {
            state.list.sort = action.payload;
        })
        .addCase(setNewEntry, (state) => {
            if (state.shipDate) {
                state.current.entry = {...newEntry(), ShipDate: state.shipDate}
                state.current.workOrder = null;
            }
        })

});

export default manifestReducer;
