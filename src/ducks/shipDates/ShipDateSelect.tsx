import React, {ChangeEvent, useEffect} from "react";
import {Select} from "chums-components";
import {useSelector} from "react-redux";
import {
    loadShipDates,
    selectCurrentShipDate,
    selectShipDates,
    selectShipDatesLoaded,
    selectShipDatesLoading,
    setCurrentShipDate
} from "./index";
import {useAppDispatch} from "../../app/configureStore";

export interface ShipDateOption {
    date: string,
}

const ShipDateOption: React.FC<ShipDateOption> = ({date}) => {
    const d = new Date(date);
    return (
        <option value={date}>{d.toLocaleDateString()}</option>
    )
}

const ShipDateSelect: React.FC = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectShipDates);
    const value = useSelector(selectCurrentShipDate);
    const loading = useSelector(selectShipDatesLoading);
    const loaded = useSelector(selectShipDatesLoaded);

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadShipDates());
        }
    }, [loaded, loading]);

    const onChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCurrentShipDate(ev.target.value));
    }
    return (
        <Select value={value ?? ''} onChange={onChange} bsSize="sm">
            <option value="">Select Ship Date</option>
            <option disabled>---</option>
            {list.map(date => (<ShipDateOption date={date} key={date}/>))}
        </Select>
    )
}

export default ShipDateSelect;
