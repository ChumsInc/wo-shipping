import {combineReducers} from "redux";
import {ManifestEntry, manifestLineSorter, ManifestEntrySorterProps, WorkOrder} from "../../types";
import {ActionInterface} from "chums-ducks";
import {shipDateSelected} from "../shipDates";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import LocalStore from "../../LocalStore";
import {CURRENT_DATE} from "../../constants";

export const newEntry:ManifestEntry = {
    id: 0,
    Company: 'chums',
    ShipDate: '',
    QuantityShipped: 0,
    WorkOrderNo: '',
}

export interface ManifestState {
    list: ManifestEntry[],
    selected: ManifestEntry,
    workOrder: WorkOrder|null,
    saving: boolean,
    loading: boolean,
    loaded: boolean,
}
export const defaultState:ManifestState = {
    list: [],
    selected: newEntry,
    workOrder: null,
    saving: false,
    loading: false,
    loaded: false,
}

export const defaultSort:ManifestEntrySorterProps = {field: 'id', ascending: false};

export interface ManifestAction extends ActionInterface {
    payload?: {
        list?: ManifestEntry[],
        entry?: ManifestEntry,
        workOrder?:WorkOrder;
        change?: object,
        shipDates?: string[],
        error?: Error,
        context?: string,
    }
}
export interface ManifestThunkAction extends ThunkAction<any, RootState, unknown, ActionInterface> {}


export const loadManifestEntriesRequested = 'manifests/loadEntriesRequested';
export const loadManifestEntriesSucceeded = 'manifests/loadEntriesSucceeded';
export const loadManifestEntriesFailed = 'manifests/loadEntriesFailed';

export const manifestEntryChanged = 'manifest/entryChanged';
export const manifestEntrySelected = 'manifest/entrySelected';

export const loadManifestEntryRequested = 'manifests/loadEntryRequested';
export const loadManifestEntrySucceeded = 'manifests/loadEntrySucceeded';
export const loadManifestEntryFailed = 'manifests/loadEntryFailed';

export const saveManifestEntryRequested = 'manifests/saveEntryRequested';
export const saveManifestEntrySucceeded = 'manifests/saveEntrySucceeded';
export const saveManifestEntryFailed = 'manifests/saveEntryFailed';

export const deleteManifestEntryRequested = 'manifests/deleteEntryRequested';
export const deleteManifestEntrySucceeded = 'manifests/deleteEntrySucceeded';
export const deleteManifestEntryFailed = 'manifests/deleteEntryFailed';

export const loadWorkOrderRequested = 'manifests/loadWorkOrderRequested';
export const loadWorkOrderSucceeded = 'manifests/loadWorkOrderSucceeded';
export const loadWorkOrderFailed = 'manifests/loadWorkOrderFailed';

export const listSelector = (sort:ManifestEntrySorterProps) => (state:RootState) => state.manifests.list.sort(manifestLineSorter(sort));
export const selectedEntrySelector = (state:RootState) => state.manifests.selected;
export const loadingSelectedSelector = (state:RootState) => state.manifests.loadingSelected;
export const savingSelector = (state:RootState) => state.manifests.saving;
export const loadingEntriesSelector = (state:RootState) => state.manifests.loading;
export const loadedEntriesSelector = (state:RootState) => state.manifests.loaded;
export const workOrderSelector = (state:RootState) => state.manifests.workOrder;
export const loadingWorkOrderSelector = (state:RootState) => state.manifests.workOrderLoading;


const listReducer = (state:ManifestEntry[] = defaultState.list, action:ManifestAction):ManifestEntry[] => {
    const {type, payload} = action;
    switch (type) {
    case loadManifestEntriesSucceeded:
        if (payload?.list) {
            return payload.list.sort(manifestLineSorter(defaultSort));
        }
        return state;
    case loadManifestEntrySucceeded:
    case saveManifestEntrySucceeded:
        if (payload?.entry) {
            const {id} = payload.entry;
            return [
                ...state.filter(entry => entry.id !== id),
                payload.entry,
            ].sort(manifestLineSorter(defaultSort));
        }
        return state;
    case shipDateSelected:
        return [];
    default:
        return state;
    }
}

const selectedReducer = (state:ManifestEntry = defaultState.selected, action:ManifestAction):ManifestEntry => {
    const currentShipDate = state.ShipDate || LocalStore.getItem(CURRENT_DATE) || '';
    const {type, payload} = action;
    switch (type) {
    case manifestEntryChanged:
        if (payload?.change) {
            return {
                ...state,
                ...payload.change,
            }
        }
        return state;
    case saveManifestEntrySucceeded:
    case deleteManifestEntrySucceeded:
        return {...newEntry, ShipDate: currentShipDate ? new Date(currentShipDate).toISOString() : ''};
    case loadManifestEntriesSucceeded:
    case manifestEntrySelected:
        return payload?.entry || {...newEntry, ShipDate: currentShipDate ? new Date(currentShipDate).toISOString() : ''};
    default: return state;
    }
}

const workOrderReducer = (state:WorkOrder|null = defaultState.workOrder, action:ManifestAction):WorkOrder|null => {
    const {type, payload} = action;
    switch (type) {
    case saveManifestEntrySucceeded:
    case deleteManifestEntrySucceeded:
        return null;
    case loadWorkOrderSucceeded:
    case loadManifestEntrySucceeded:
    case manifestEntrySelected:
        return payload?.workOrder || null;
    default: return state;
    }
}

const savingReducer = (state:boolean = defaultState.saving, action:ManifestAction):boolean => {
    switch (action.type) {
    case saveManifestEntryRequested:
    case deleteManifestEntryRequested:
        return true;
    case saveManifestEntrySucceeded:
    case saveManifestEntryFailed:
    case deleteManifestEntrySucceeded:
    case deleteManifestEntryFailed:
        return false;
    default: return state;
    }
}

const loadingSelectedReducer = (state:boolean = defaultState.saving, action:ManifestAction):boolean => {
    switch (action.type) {
    case loadManifestEntryRequested:
        return true;
    case loadManifestEntrySucceeded:
    case loadManifestEntryFailed:
        return false;
    default: return state;
    }
}

const loadingReducer = (state:boolean = defaultState.saving, action:ManifestAction):boolean => {
    switch (action.type) {
    case loadManifestEntriesRequested:
        return true;
    case loadManifestEntriesSucceeded:
    case loadManifestEntriesFailed:
        return false;
    default: return state;
    }
}

const workOrderLoadingReducer = (state:boolean = defaultState.saving, action:ManifestAction):boolean => {
    switch (action.type) {
    case loadWorkOrderRequested:
        return true;
    case loadWorkOrderSucceeded:
    case loadWorkOrderFailed:
        return false;
    default: return state;
    }
}

const loadedReducer = (state:boolean = defaultState.saving, action:ManifestAction):boolean => {
    switch (action.type) {
    case loadManifestEntriesSucceeded:
        return true;
    case shipDateSelected:
        return false;
    default: return state;
    }
}

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    workOrder: workOrderReducer,
    saving: savingReducer,
    loadingSelected: loadingSelectedReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
    workOrderLoading: workOrderLoadingReducer,
})
