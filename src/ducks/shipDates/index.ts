import {RootState} from "../../app/configureStore";
import LocalStore, {CURRENT_DATE} from "../../LocalStore";
import {createAction, createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {loadManifestEntries, saveManifestEntry} from "../manifest/actions";
import {ShipDateResponse} from "../../types";
import {fetchShipDates} from "../../api/manifest";

export interface ShipDatesState {
    list: string[]
    current: string | null,
    loading: boolean,
    loaded: boolean,
}

export const initialShipDatesState: ShipDatesState = {
    list: [],
    current: LocalStore.getItem<string | null>(CURRENT_DATE, null) ?? null,
    loading: false,
    loaded: false,
}

export const setCurrentShipDate = createAction('shipDates/setCurrent', (value: string | null) => {
    LocalStore.setItem<string | null>(CURRENT_DATE, value);
    return {
        payload: value
    };
});
export const loadShipDates = createAsyncThunk<ShipDateResponse[]>(
    'shipDates/load',
    async () => {
        return await fetchShipDates();
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectShipDatesLoading(state);
        }
    }
)

export const selectShipDates = (state: RootState) => state.shipDates.list;
export const selectCurrentShipDate = (state: RootState) => state.shipDates.current;
export const selectShipDatesLoading = (state: RootState) => state.shipDates.loading;
export const selectShipDatesLoaded = (state: RootState) => state.shipDates.loaded;

const shipDatesReducer = createReducer(initialShipDatesState, builder => {
    builder
        .addCase(setCurrentShipDate, (state, action) => {
            state.current = action.payload;
            if (action.payload) {
                state.list = [
                    ...state.list.filter(date => date !== action.payload),
                    action.payload,
                ].sort().reverse();
            }
        })
        .addCase(loadShipDates.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadShipDates.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = action.payload.map(sd => sd.ShipDate).sort().reverse();
        })
        .addCase(loadShipDates.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loadManifestEntries.fulfilled, (state, action) => {
            state.list = action.payload.shipDates.map(sd => sd.ShipDate).sort().reverse();
            state.loaded = true;
        })
        .addCase(saveManifestEntry.fulfilled, (state, action) => {
            state.list = action.payload.shipDates.map(sd => sd.ShipDate).sort().reverse();
            state.loaded = true;
        })

});

export default shipDatesReducer;

