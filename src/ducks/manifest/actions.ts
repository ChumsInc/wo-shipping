import formatDate from "date-fns/format";
import {
    deleteManifestEntryRequested,
    deleteManifestEntrySucceeded,
    loadManifestEntriesFailed,
    loadManifestEntriesRequested,
    loadManifestEntriesSucceeded,
    loadManifestEntryFailed,
    loadManifestEntryRequested,
    loadManifestEntrySucceeded,
    loadWorkOrderFailed,
    loadWorkOrderRequested,
    loadWorkOrderSucceeded,
    manifestEntryChanged,
    manifestEntrySelected,
    saveManifestEntryFailed,
    saveManifestEntryRequested,
    saveManifestEntrySucceeded,
} from "./actionTypes";
import {loadingShipDateSelector, selectedShipDateSelector} from "../shipDates";
import {fetchDELETE, fetchJSON, fetchPOST} from "chums-ducks";
import {ManifestEntry, ShipDateResponse, WorkOrder} from "../../types";
import {parseISO} from "date-fns";
import {loadingSelectedSelector, ManifestThunkAction, savingSelector} from "./index";

export const selectEntryAction = (entry: ManifestEntry): ManifestThunkAction =>
    (dispatch) => {
        dispatch({type: manifestEntrySelected, payload: {entry}});
        if (entry.id) {
            dispatch(fetchEntryAction(entry.id));
        }
    }
export const entryChangedAction = (change: object) => ({type: manifestEntryChanged, payload: {change}})

export const fetchManifestEntriesAction = (): ManifestThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const ShipDate = selectedShipDateSelector(state);
            if (!ShipDate || loadingShipDateSelector(state)) {
                return;
            }

            dispatch({type: loadManifestEntriesRequested});
            const url = '/api/operations/production/wo/shipping/chums/:ShipDate'
                .replace(':ShipDate', encodeURIComponent(formatDate(new Date(ShipDate), 'yyyy-MM-dd')));
            const {list, shipDates} = await fetchJSON(url, {cache: "no-cache"});
            const dates = shipDates.map((date: ShipDateResponse) => date.ShipDate);
            dispatch({type: loadManifestEntriesSucceeded, payload: {list, shipDates: dates}});
        } catch (err) {
            console.log("fetchManifestEntriesAction()", err.message);
            dispatch({type: loadManifestEntriesFailed, payload: {error: err, context: loadManifestEntriesRequested}});
        }
    };

export const fetchEntryAction = (id: number): ManifestThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (loadingSelectedSelector(state) || savingSelector(state)) {
                return;
            }

            const payload: { entry: ManifestEntry | null, workOrder: WorkOrder | null } = {
                entry: null,
                workOrder: null,
            };
            dispatch({type: loadManifestEntryRequested});
            const url = '/api/operations/production/wo/shipping/:id'
                .replace(':id', encodeURIComponent(id));
            const {entry} = await fetchJSON(url, {cache: 'no-cache'});
            payload.entry = entry || null;
            if (entry && entry.WorkOrderNo) {
                payload.workOrder = await fetchWorkOrder(entry.WorkOrderNo);
            }
            dispatch({type: loadManifestEntrySucceeded, payload});
        } catch (err) {
            console.log("fetchEntryAction()", err.message);
            dispatch({type: loadManifestEntryFailed, payload: {error: err, context: loadManifestEntryRequested}})
        }
    };

export const saveEntryAction = (entry: ManifestEntry): ManifestThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (savingSelector(state) || loadingShipDateSelector(state) || loadingSelectedSelector(state)) {
                return;
            }
            dispatch({type: saveManifestEntryRequested});
            const {id, Company, WorkOrderNo, QuantityShipped, ShipDate, Comment} = entry;
            const url = '/api/operations/production/wo/shipping/:id'
                .replace(':id', encodeURIComponent(id));
            const body = {
                id,
                Company,
                WorkOrderNo,
                QuantityShipped,
                ShipDate: formatDate(parseISO(ShipDate), 'yyyy-MM-dd'),
                Comment,
            };
            await fetchPOST(url, body);
            dispatch({type: saveManifestEntrySucceeded, payload: {shipDate: ShipDate}});
            dispatch(fetchManifestEntriesAction());
        } catch (err) {
            console.log("saveEntryAction()", err.message);
            dispatch({type: saveManifestEntryFailed, payload: {error: err, context: saveManifestEntryRequested}});
        }
    };

export const deleteEntryAction = ({id}: ManifestEntry): ManifestThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (loadingShipDateSelector(state) || savingSelector(state) || loadingSelectedSelector(state)) {
                return;
            }
            dispatch({type: deleteManifestEntryRequested});
            const url = '/api/operations/production/wo/shipping/:id'
                .replace(':id', encodeURIComponent(id));
            await fetchDELETE(url)
            dispatch({type: deleteManifestEntrySucceeded});
            dispatch(fetchManifestEntriesAction());
        } catch (err) {
            console.log("deleteEntryAction()", err.message);
            return Promise.reject(err);
        }
    };


async function fetchWorkOrder(WorkOrderNo: string) {
    try {
        if (!WorkOrderNo || !WorkOrderNo.trim()) {
            return null;
        }
        const urlWorkOrder = '/api/operations/production/wo/chums/:WorkOrderNo'
            .replace(':WorkOrderNo', encodeURIComponent(WorkOrderNo.padStart(7, '0')));
        const {workorder} = await fetchJSON(urlWorkOrder, {cache: 'no-cache'});
        return workorder;
    } catch (err) {
        console.log("fetchWorkOrder()", err.message);
        return Promise.reject(err);
    }
}

export const fetchWorkOrderAction = (WorkOrderNo: string): ManifestThunkAction =>
    async (dispatch) => {
        try {
            if (!WorkOrderNo || WorkOrderNo.trim() === '') {
                return;
            }
            dispatch({type: loadWorkOrderRequested});
            const workOrder = await fetchWorkOrder(WorkOrderNo);
            dispatch({type: loadWorkOrderSucceeded, payload: {workOrder: workOrder || null}});
        } catch (err) {
            console.log("fetchWorkOrderAction()", err.message);
            dispatch({type: loadWorkOrderFailed, payload: {error: err, context: loadWorkOrderRequested}});
        }
    };
