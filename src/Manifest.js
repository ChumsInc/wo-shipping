import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {fetchEntries, fetchEntry, fetchShipDates, setCompany, setShipDate} from "./actions";
import SortableTable from "./SortableTable";
import formatDate from 'date-fns/format';
import {defaultFilter, TABS, CURRENT_ROWS} from "./constants";
import LocalStore from "./LocalStore";
import numeral from 'numeral';

const tableFields = [
    {field: 'id', title: 'ID'},
    // {name: 'Company', title: 'Company'},
    {field: 'WorkOrderNo', title: 'Work Order'},
    {field: 'WarehouseCode', title: 'Whse'},
    {field: 'ItemCode', title: 'Item'},
    {field: 'ItemCodeDesc', title: 'Description'},
    {field: 'QuantityShipped', title: 'Qty Shipped', render: (row) => numeral(row.QuantityShipped).format('0,0')},
    {field: 'QuantityOrdered', title: 'Qty Ordered', render: (row) => numeral(row.QuantityOrdered).format('0,0')},
    {field: 'PackDate', title: 'Packed', render: (row) => formatDate(row.PackDate, 'MM/DD/YY')},
    {field: 'ShipDate', title: 'Ship', render: (row) => formatDate(row.ShipDate, 'MM/DD/YY')},
    {field: 'MakeFor', title: 'For'},
];


class Manifest extends Component {
    static propTypes = {
        entries: PropTypes.shape({
            busy: PropTypes.bool,
            list: PropTypes.array,
        }),
        filter: PropTypes.shape({
            WorkOrderNo: PropTypes.string,
            WarehouseCode: PropTypes.string,
            ItemCode: PropTypes.string,
            SalesOrderNo: PropTypes.string,
        }),
        tab: PropTypes.number,
        fetchEntry: PropTypes.func.isRequired,
    };

    static defaultProps = {
        entries: {
            busy: false,
            list: [],
        },
        filter: {...defaultFilter},
        tab: TABS.ENTRY,
    };

    state = {
        page: 1,
        rowsPerPage: LocalStore.getItem(CURRENT_ROWS) || 10,
    };

    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.onChangeRows = this.onChangeRows.bind(this);
    }

    onSelect({id}) {
        this.props.fetchEntry({id});
    }

    onChangeRows(rowsPerPage) {
        LocalStore.setItem(CURRENT_ROWS, rowsPerPage);
        this.setState({rowsPerPage})
    }

    // sorter(a, b)

    render() {
        const {busy, list} = this.props.entries;
        const {page, rowsPerPage} = this.state;
        const {tab, filter} = this.props;

        const woFilter = new RegExp(filter.WorkOrderNo || '^', 'i');
        const whseFilter = new RegExp(filter.WarehouseCode || '^', 'i');
        const itemFilter = new RegExp(filter.ItemCode || '^', 'i');
        const soFilter = new RegExp(filter.SalesOrderNo || '^', 'i');
        const data = list.filter(row =>
            tab === TABS.ENTRY
            || (
                woFilter.test(row.WorkOrderNo)
                && whseFilter.test(row.WarehouseCode)
                && itemFilter.test(row.ItemCode)
                && soFilter.test(row.MakeFor)
            )
        );
        const total = {
            QuantityShipped: 0,
            QuantityOrdered: 0,
        }
        data.forEach(row => {
            total.QuantityShipped += row.QuantityShipped;
            total.QuantityOrdered += row.QuantityOrdered;
        })

        return (
            <div>
                <SortableTable data={data} fields={tableFields} onSelect={this.onSelect} className="table-sm" filtered={list.length !== data.length}
                               defaultSort={{field: 'id', asc: false}} page={page} rowsPerPage={rowsPerPage}
                               onChangePage={page => this.setState({page})} onChangeSort={() => this.setState({page: 1})}
                               onChangeRowsPerPage={this.onChangeRows}
                               hasFooter={true}
                               footerData={total}
                />
            </div>
        );
    }

}

const mapStateToProps = ({entries, filter, tab}) => {
    return {entries, filter, tab};
};

const mapDispatchToProps = {
    onChangeCompany: setCompany,
    onChangeShipDate: setShipDate,
    onSubmit: fetchEntries,
    fetchShipDates: fetchShipDates,
    fetchEntry,

};

export default connect(mapStateToProps, mapDispatchToProps)(Manifest);
