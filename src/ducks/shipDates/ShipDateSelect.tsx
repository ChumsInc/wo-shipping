import React, {SelectHTMLAttributes} from "react";
import classNames from "classnames";

export interface ShipDateOption {
    date: string,
}

const ShipDateOption = ({date}: ShipDateOption) => {
    const d = new Date(date);
    return (
        <option value={date}>{d.toLocaleDateString()}</option>
    )
}

export interface ShipDateSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    defaultLabel?: string;
    values: string[]
}

const ShipDateSelect = ({defaultLabel = 'Select Ship Date', className, values = [], ...rest}: ShipDateSelectProps) => {
    return (
        <select className={classNames(className, "form-select form-select-sm")} {...rest}>
            <option value="">{defaultLabel}</option>
            <option disabled>---</option>
            {values.map(date => (<ShipDateOption date={date} key={date}/>))}
        </select>
    )
}

export default ShipDateSelect;
