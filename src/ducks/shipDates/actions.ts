import {fetchJSON} from 'chums-ducks';
import {
    loadShipDateFailed,
    loadShipDateRequested,
    loadShipDateSucceeded,
    shipDateSelected,
} from "./actionTypes";
import {ShipDateResponse} from "../../types";
import {loadingShipDateSelector, ShipDateAction, ShipDateThunkAction} from "./index";

export const selectShipDateAction = (selected: string): ShipDateAction => ({
    type: shipDateSelected,
    payload: {selected}
});

export const fetchShipDatesAction = (): ShipDateThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (loadingShipDateSelector(state)) {
                return;
            }
            dispatch({type: loadShipDateRequested});
            const url = '/api/operations/production/wo/shipping/chums';
            const {dates} = await fetchJSON(url, {cache: 'no-cache'});
            const list = dates.map((date: ShipDateResponse) => date.ShipDate);
            dispatch({type: loadShipDateSucceeded, payload: {list}});
        } catch (err) {
            console.log("fetchShipDates()", err.message);
            dispatch({type: loadShipDateFailed, payload: {error: err, context: loadShipDateRequested}});
        }
    };
