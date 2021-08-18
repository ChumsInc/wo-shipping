import { ManifestEntry, ManifestEntrySorterProps, WorkOrder } from "../../types";
import { ActionInterface } from "chums-ducks";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../index";
export declare const newEntry: ManifestEntry;
export interface ManifestState {
    list: ManifestEntry[];
    selected: ManifestEntry;
    workOrder: WorkOrder | null;
    saving: boolean;
    loading: boolean;
    loaded: boolean;
}
export declare const defaultState: ManifestState;
export declare const defaultSort: ManifestEntrySorterProps;
export interface ManifestAction extends ActionInterface {
    payload?: {
        list?: ManifestEntry[];
        entry?: ManifestEntry;
        workOrder?: WorkOrder;
        change?: object;
        shipDates?: string[];
        error?: Error;
        context?: string;
    };
}
export interface ManifestThunkAction extends ThunkAction<any, RootState, unknown, ActionInterface> {
}
export declare const loadManifestEntriesRequested = "manifests/loadEntriesRequested";
export declare const loadManifestEntriesSucceeded = "manifests/loadEntriesSucceeded";
export declare const loadManifestEntriesFailed = "manifests/loadEntriesFailed";
export declare const manifestEntryChanged = "manifest/entryChanged";
export declare const manifestEntrySelected = "manifest/entrySelected";
export declare const loadManifestEntryRequested = "manifests/loadEntryRequested";
export declare const loadManifestEntrySucceeded = "manifests/loadEntrySucceeded";
export declare const loadManifestEntryFailed = "manifests/loadEntryFailed";
export declare const saveManifestEntryRequested = "manifests/saveEntryRequested";
export declare const saveManifestEntrySucceeded = "manifests/saveEntrySucceeded";
export declare const saveManifestEntryFailed = "manifests/saveEntryFailed";
export declare const deleteManifestEntryRequested = "manifests/deleteEntryRequested";
export declare const deleteManifestEntrySucceeded = "manifests/deleteEntrySucceeded";
export declare const deleteManifestEntryFailed = "manifests/deleteEntryFailed";
export declare const loadWorkOrderRequested = "manifests/loadWorkOrderRequested";
export declare const loadWorkOrderSucceeded = "manifests/loadWorkOrderSucceeded";
export declare const loadWorkOrderFailed = "manifests/loadWorkOrderFailed";
export declare const listSelector: (sort: ManifestEntrySorterProps) => (state: RootState) => ManifestEntry[];
export declare const selectedEntrySelector: (state: RootState) => ManifestEntry;
export declare const loadingSelectedSelector: (state: RootState) => boolean;
export declare const savingSelector: (state: RootState) => boolean;
export declare const loadingEntriesSelector: (state: RootState) => boolean;
export declare const loadedEntriesSelector: (state: RootState) => boolean;
export declare const workOrderSelector: (state: RootState) => WorkOrder | null;
export declare const loadingWorkOrderSelector: (state: RootState) => boolean;
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    list: ManifestEntry[];
    selected: ManifestEntry;
    workOrder: WorkOrder | null;
    saving: boolean;
    loadingSelected: boolean;
    loading: boolean;
    loaded: boolean;
    workOrderLoading: boolean;
}>, ManifestAction>;
export default _default;
