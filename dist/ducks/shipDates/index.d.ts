import { ActionInterface } from 'chums-ducks';
import { ThunkAction } from "redux-thunk";
import { RootState } from "../index";
export interface ShipDatesState {
    list: string[];
    selected: string;
    loading: boolean;
    loaded: boolean;
}
export declare const defaultState: ShipDatesState;
export interface ShipDateAction extends ActionInterface {
    payload?: {
        list?: string[];
        selected?: string;
        error?: Error;
        context?: string;
    };
}
export interface ShipDateThunkAction extends ThunkAction<any, RootState, unknown, ShipDateAction> {
}
export declare const loadShipDateRequested = "shipDates/loadRequested";
export declare const loadShipDateSucceeded = "shipDates/loadSucceeded";
export declare const loadShipDateFailed = "shipDates/loadFailed";
export declare const shipDateSelected = "shipDates/selected";
export declare const shipDateListSelector: (state: RootState) => string[];
export declare const selectedShipDateSelector: (state: RootState) => string;
export declare const loadingShipDateSelector: (state: RootState) => boolean;
export declare const loadedSelector: (state: RootState) => boolean;
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    list: string[];
    selected: string;
    loading: boolean;
    loaded: boolean;
}>, ShipDateAction>;
export default _default;
