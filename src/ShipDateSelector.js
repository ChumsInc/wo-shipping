import React, {Component} from 'react';
import PropTypes from 'prop-types';
import formatDate from "date-fns/format";
import Select from "./Select";

export default class ShipDateSelector extends Component {
    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
        options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])),
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        value: new Date(),
        options: [],
    };

    render() {
        const {value, options, onChange} = this.props;
        return (
            <Select value={value || ''} onChange={onChange} field="ShipDate">
                <option value="">Select Ship Date</option>
                {options.map(d => <option value={d} key={d}>{formatDate(d, 'DD MMM YYYY')}</option>)}
            </Select>
        )
    }
}
