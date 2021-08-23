import {ManifestEntry, ManifestEntrySorterProps, manifestLineSorter, WorkOrder} from "../../types";
import {RootState} from "../index";
import {ActionInterface} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {shipDateSelected} from "../shipDates/actionTypes";
import LocalStore, {CURRENT_DATE} from "../../LocalStore";
import {combineReducers} from "redux";
import {
    deleteManifestEntryFailed,
    deleteManifestEntryRequested,
    deleteManifestEntrySucceeded, loadManifestEntriesFailed, loadManifestEntriesRequested,
    loadManifestEntriesSucceeded, loadManifestEntryFailed, loadManifestEntryRequested,
    loadManifestEntrySucceeded, loadWorkOrderFailed, loadWorkOrderRequested, loadWorkOrderSucceeded,
    manifestEntryChanged, manifestEntrySelected, saveManifestEntryFailed, saveManifestEntryRequested,
    saveManifestEntrySucceeded
} from "./actionTypes";


export interface ManifestState {
    list: ManifestEntry[],
    selected: ManifestEntry,
    workOrder: WorkOrder | null,
    saving: boolean,
    loading: boolean,
    loaded: boolean,
}

export interface ManifestAction extends ActionInterface {
    payload?: {
        list?: ManifestEntry[],
        entry?: ManifestEntry,
        workOrder?: WorkOrder;
        change?: object,
        shipDates?: string[],
        shipDate?: string,
        error?: Error,
        context?: string,
    }
}

export interface ManifestThunkAction extends ThunkAction<any, RootState, unknown, ActionInterface> {
}

export const newEntry: ManifestEntry = {
    id: 0,
    Company: 'chums',
    ShipDate: '',
    QuantityShipped: 0,
    QuantityOrdered: 0,
    WorkOrderNo: '',
}

export const defaultState: ManifestState = {
    list: [],
    selected: newEntry,
    workOrder: null,
    saving: false,
    loading: false,
    loaded: false,
}

export const defaultSort: ManifestEntrySorterProps = {field: 'id', ascending: false};



export const listSelector = (sort: ManifestEntrySorterProps) => (state: RootState) => state.manifests.list.sort(manifestLineSorter(sort));
export const selectedEntrySelector = (state: RootState) => state.manifests.selected;
export const loadingSelectedSelector = (state: RootState) => state.manifests.loadingSelected;
export const savingSelector = (state: RootState) => state.manifests.saving;
export const loadingEntriesSelector = (state: RootState) => state.manifests.loading;
export const loadedEntriesSelector = (state: RootState) => state.manifests.loaded;
export const workOrderSelector = (state: RootState) => state.manifests.workOrder;
export const loadingWorkOrderSelector = (state: RootState) => state.manifests.workOrderLoading;


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
    case loadWorkOrderSucceeded:
        if (payload?.workOrder) {
            return {
                ...state,
                QuantityOrdered: payload.workOrder.QtyOrdered,
                WorkOrderNo: payload.workOrder.WorkOrder,
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
