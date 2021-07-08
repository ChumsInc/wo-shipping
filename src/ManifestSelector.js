import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {fetchEntries, fetchShipDates, setCompany, setShipDate} from './actions';
import Select from "./Select";
import FormGroup from "./FormGroup";
import formatDate from 'date-fns/format';
import ShipDateSelector from "./ShipDateSelector";
import LocalStore from "./LocalStore";
import {CURRENT_DATE} from "./constants";

class ManifestSelector extends Component {
    static propTypes = {
        Company: PropTypes.string.isRequired,
        shipDates: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])).isRequired,
        ShipDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
        onChangeCompany: PropTypes.func.isRequired,
        onChangeShipDate: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        fetchShipDates: PropTypes.func.isRequired
    };

    static defaultProps = {
        Company: 'chums',
        shipDates: '',
        ShipDate: new Date(),
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.props.fetchShipDates({Company: this.props.Company});
    }


    onChange({field, value}) {
        switch (field) {
        case 'Company':
            return this.props.onChangeCompany(value);
        case 'ShipDate':
            LocalStore.setItem(CURRENT_DATE, value);
            return this.props.onChangeShipDate(value);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {Company, ShipDate} = this.props;
        if (prevProps.Company !== Company || prevProps.ShipDate !== ShipDate) {
            this.props.onSubmit({Company, ShipDate});
        }
    }

    onSubmit(ev) {
        ev.preventDefault();
        const {Company, ShipDate} = this.props;
        this.props.onSubmit({Company, ShipDate});
    }

    render() {
        const {Company, shipDates, ShipDate} = this.props;
        return (
            <form className="form-inline row mb-3" onSubmit={this.onSubmit}>
                <FormGroup inline={true} label="Company">
                    <Select value={Company} onChange={this.onChange} field="Company" required>
                        <option value="chums">Chums</option>
                        <option value="bc">Beyond Coastal</option>
                    </Select>
                </FormGroup>
                <FormGroup inline={true} label="Ship Date">
                    <ShipDateSelector onChange={this.onChange} value={ShipDate} options={shipDates} />
                </FormGroup>
                <button type="submit" className="btn btn-sm btn-primary mx-1">Reload</button>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    const {Company, shipDates, ShipDate} = state;
    return {Company, shipDates, ShipDate};
};

const mapDispatchToProps = {
    onChangeCompany: setCompany,
    onChangeShipDate: setShipDate,
    onSubmit: fetchEntries,
    fetchShipDates: fetchShipDates,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManifestSelector);
