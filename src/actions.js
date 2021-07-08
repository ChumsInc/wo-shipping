import {fetchDELETE, fetchGET, fetchPOST} from './fetch';
import formatDate from 'date-fns/format';
import parseDate from 'date-fns/parse';
import {
    DELETE_ENTRY,
    DISMISS_ALERT, FETCH_ENTRY,
    FETCH_LIST,
    FETCH_SHIP_DATES, FETCH_WORK_ORDER, NEW_ENTRY, SAVE_ENTRY,
    SET_ALERT, SET_COMPANY, SET_ENTRY, SET_FILTER,
    SET_QUANTITY,
    SET_SHIP_DATE, SET_TAB,
    SET_WORK_ORDER
} from "./constants";

export const setAlert = ({
                             type = 'warning',
                             title = 'Oops!',
                             message = 'There was an error'}) => ({type: SET_ALERT, alert: {type, title, message}});

export const dismissAlert = (id) => ({type: DISMISS_ALERT, id});

export const setCompany = (company) => ({type: SET_COMPANY, value: company});
export const setShipDate = (date) => ({type: SET_SHIP_DATE, value: date});
export const setEntry = (entry) => ({type: SET_ENTRY, payload: entry});
export const newEntry = ({Company, ShipDate}) => ({type: NEW_ENTRY, payload: {Company, ShipDate}});
export const setTab = (tab) => ({type: SET_TAB, tab});

export const padWorkOrderNo = (workOrderNo) => ({type: SET_WORK_ORDER, value: workOrderNo.padStart(7, '0')});

export const fetchShipDates = ({Company}) => (dispatch, getState) => {
    const url = '/node-dev/production/wo/shipping/:Company'
        .replace(':Company', encodeURIComponent(Company));
    dispatch({type: FETCH_SHIP_DATES, payload: {busy: true}});
    fetchGET(url)
        .then(res => {
            const dates = res.dates
                .map(entry => parseDate(entry.ShipDate));
            dispatch({type: FETCH_SHIP_DATES, payload: {dates}});
        })
        .catch(err => {
            dispatch(setAlert({type: 'error', message: err.message}));
            dispatch({type: FETCH_SHIP_DATES, payload: {}});
        });
};

export const fetchWorkOrder = ({Company, WorkOrderNo}) => (dispatch, getState) => {
    if (!WorkOrderNo || WorkOrderNo.trim() === '') {
        return;
    }
    const url = '/node-dev/production/wo/:Company/:WorkOrderNo'
        .replace(':Company', encodeURIComponent(Company))
        .replace(':WorkOrderNo', encodeURIComponent(WorkOrderNo.padStart(7, '0')));
    dispatch({type: FETCH_WORK_ORDER, payload: {busy: true}});
    fetchGET(url)
        .then(res => {
            dispatch({type: FETCH_WORK_ORDER, payload: res.workorder});
        })
        .catch(err => {
            dispatch(setAlert({type: 'error', message: err.message}));
            dispatch({type: FETCH_WORK_ORDER, payload: {}});
        })
};

export const fetchEntries = ({Company, ShipDate}) => (dispatch) => {
    const url = '/node-dev/production/wo/shipping/:Company/:ShipDate'
        .replace(':Company', encodeURIComponent(Company))
        .replace(':ShipDate', encodeURIComponent(formatDate(ShipDate, 'YYYY-MM-DD')));
    dispatch({type: FETCH_LIST, payload: {busy: true}});
    fetchGET(url)
        .then(res => {
            const dates = res.shipDates
                .map(entry => parseDate(entry.ShipDate));

            dispatch({type: FETCH_LIST, payload: {list: res.list, dates}});
        })
        .catch(err => {
            dispatch(setAlert({type: 'error', message: err.message}));
            dispatch({type: FETCH_LIST, payload: {}});
        });
};

export const fetchEntry = ({id}) => (dispatch, getState) => {
    const url = '/node-dev/production/wo/shipping/:id'
        .replace(':id', encodeURIComponent(id));
    dispatch({type: FETCH_ENTRY, payload: {busy: true}});
    fetchGET(url)
        .then(res => {
            dispatch({type: FETCH_ENTRY, payload: res.entry || {}});
            dispatch(fetchWorkOrder(res.entry));
        })
        .catch(err => {
            dispatch(setAlert({type: 'error', message: err.message}));
            dispatch({type: FETCH_ENTRY, payload: {}});
        });
};

export const saveEntry = ({id = 0, Company, WorkOrderNo, QuantityShipped, ShipDate}) => (dispatch, getState) => {
    const url = '/node-dev/production/wo/shipping/:id'
        .replace(':id', encodeURIComponent(id));
    dispatch({type: SAVE_ENTRY, payload: {busy: true}});
    fetchPOST(url, {id, Company, WorkOrderNo, QuantityShipped, ShipDate: formatDate(parseDate(ShipDate), 'YYYY-MM-DD')})
        .then(res => {
            dispatch(newEntry({Company, ShipDate}));
            dispatch(fetchEntries({Company, ShipDate}));
        })
        .catch(err => {
            dispatch(setAlert({type: 'error', message: err.message}));
            dispatch({type: SAVE_ENTRY, payload: {}});
        });
};

export const deleteEntry = ({id}) => (dispatch, getState) => {
    const {Company, ShipDate} = getState();
    const url = '/node-dev/production/wo/shipping/:id'
        .replace(':id', encodeURIComponent(id));
    dispatch({type: DELETE_ENTRY, payload: {busy: true}});
    fetchDELETE(url)
        .then(res => {
            dispatch({type: DELETE_ENTRY, payload: {id}});
            dispatch(newEntry({Company, ShipDate}));
            dispatch(fetchEntries({Company, ShipDate}));
        })
        .catch(err => {
            dispatch(setAlert({type: 'error', message: err.message}));
            dispatch({type: DELETE_ENTRY, payload: {}});
        });
};

export const setFilter = (filter) => ({type: SET_FILTER, filter});
