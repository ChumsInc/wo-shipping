import React, {Component, createRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setFilter} from './actions';
import {defaultFilter} from "./constants";
import FormGroupTextInput from "./FormGroupTextInput";

class SearchForm extends Component {

    static propTypes = {
        filter: PropTypes.shape({
            WorkOrderNo: PropTypes.string,
            WarehouseCode: PropTypes.string,
            ItemCode: PropTypes.string,
            SalesOrderNo: PropTypes.string,
        }),
        setFilter: PropTypes.func.isRequired,
    };

    static defaultProps = {
        filter: {...defaultFilter}
    };

    constructor(props) {
        super(props);
        this.onChangeForm = this.onChangeForm.bind(this);
        this.onResetFilter = this.onResetFilter.bind(this);
    }

    onChangeForm({field, value}) {
        this.props.setFilter({[field]: value});
    }

    onResetFilter() {
        this.props.setFilter({...defaultFilter});
    }


    render() {
        const {WorkOrderNo, WarehouseCode, ItemCode, SalesOrderNo} = this.props.filter;
        return (
            <form className="form-inline mb-3 row">
                <FormGroupTextInput value={WorkOrderNo} field="WorkOrderNo" onChange={this.onChangeForm} label="W/O #"/>
                <FormGroupTextInput value={WarehouseCode} field="WarehouseCode" onChange={this.onChangeForm} label="Whse"/>
                <FormGroupTextInput value={ItemCode} field="ItemCode" onChange={this.onChangeForm} label="Item"/>
                <FormGroupTextInput value={SalesOrderNo} field="SalesOrderNo" onChange={this.onChangeForm} label="S/O #"/>
                <button type="reset" onClick={this.onResetFilter} className="btn btn-sm mx-1 btn-outline-secondary">Reset</button>
            </form>
        );
    }
}

const mapStateToProps = ({filter}) => {
    return {filter};
};

const mapDispatchToProps = {
    setFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
