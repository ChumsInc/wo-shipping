import React, {ChangeEvent} from "react";
import {Select} from "chums-ducks";
import {useDispatch, useSelector} from "react-redux";
import {shipDateListSelector, selectedShipDateSelector} from "./index";
import {selectShipDateAction} from "./actions";

export interface ShipDateOption {
    date: string,
}

const ShipDateOption:React.FC<ShipDateOption> = ({date}) => {
    const d = new Date(date);
    return (
        <option value={date}>{d.toLocaleDateString()}</option>
    )
}

const ShipDateSelect:React.FC = () => {
    const dispatch = useDispatch();
    const list = useSelector(shipDateListSelector);
    const value = useSelector(selectedShipDateSelector);

    const onChange = (ev:ChangeEvent<HTMLSelectElement>) => {
        dispatch(selectShipDateAction(ev.target.value));
    }
    return (
        <Select value={value} onChange={onChange} bsSize="sm">
            <option value="">Select Ship Date</option>
            <option disabled >---</option>
            {list.map(date => (<ShipDateOption date={date} key={date} />))}
        </Select>
    )
}

export default ShipDateSelect;
