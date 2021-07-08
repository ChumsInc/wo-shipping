import React, {Component, createRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {deleteEntry, fetchWorkOrder, newEntry, saveEntry, setEntry} from './actions';
import FormGroup from "./FormGroup";
import TextInput from "./TextInput";
import formatDate from "date-fns/format";
import parseDate from "date-fns/parse";
import ModalConfirm from "./ModalConfirm";
import Alert from "./Alert";


class EntryForm extends Component {
    static propTypes = {
        entry: PropTypes.shape({
            id: PropTypes.number,
            WorkOrderNo: PropTypes.string,
            Box: PropTypes.number,
            ItemCode: PropTypes.string,
            ItemCodeDesc: PropTypes.string,
            QuantityShipped: PropTypes.number,
            ShipDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
        }),
        workOrder: PropTypes.shape({
            Company: PropTypes.string,
            WorkOrder: PropTypes.string,
            ItemBillNumber: PropTypes.string,
            QtyComplete: PropTypes.number,
            QtyOrdered: PropTypes.number,
            ParentWhse: PropTypes.string,
        }),
        Company: PropTypes.string.isRequired,
        ShipDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
        fetchWorkOrder: PropTypes.func.isRequired,
        saveEntry: PropTypes.func.isRequired,
        deleteEntry: PropTypes.func.isRequired,
        newEntry: PropTypes.func.isRequired,
        setEntry: PropTypes.func.isRequired,
    };

    static defaultProps = {
        entry: {},
        Company: 'chums',
        shipDate: new Date(),
        workOrder: {
            Company: 'chums',
            WorkOrder: '',
            ItemBillNumber: '',
            QtyComplete: 0,
            QtyOrdered: 0,
            ParentWhse: '',
        }
    };

    state = {
        confirm: false,
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);

        this.loadWorkOrder = this.loadWorkOrder.bind(this);
        this.onClickNewEntry = this.onClickNewEntry.bind(this);
        this.onDeleteEntry = this.onDeleteEntry.bind(this);
        this.onCancelDelete = this.onCancelDelete.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
        this.woRef = createRef();
    }

    componentDidMount() {
        this.onClickNewEntry();
    }


    componentDidUpdate(prevProps, prevState) {
        const {Company, ShipDate} = this.props;
        if (prevProps.Company !== Company || prevProps.ShipDate !== ShipDate) {
            this.onClickNewEntry();
        }
    }


    onSubmit(ev) {
        ev.preventDefault();
        const {id = 0, Company, WorkOrderNo, QuantityShipped, ShipDate} = this.props.entry;
        this.props.saveEntry({id, Company, WorkOrderNo, QuantityShipped, ShipDate});
        this.woRef.current.focus();
    }

    loadWorkOrder() {
        this.props.fetchWorkOrder(this.props.entry);
    }

    onChange({field, value}) {
        const {entry} = this.props;
        switch (field) {
        case 'ShipDate':
            value = parseDate(value);
            break;
        }
        this.props.setEntry({...entry, [field]: value});
    }

    onClickNewEntry() {
        const {Company, ShipDate} = this.props;
        this.props.newEntry({Company, ShipDate});
    }

    onConfirmDelete() {
        this.setState({confirm: true});
    }

    onCancelDelete() {
        this.setState({confirm: false});
    }

    onDeleteEntry() {
        this.setState({confirm: false});
        this.props.deleteEntry(this.props.entry);
    }

    render() {
        const {ShipDate, entry, workOrder} = this.props;
        return (
            <form className="mb-3" onSubmit={this.onSubmit}>
                <FormGroup colWidth={10} label="Ship Date">
                    <div className="col-3">
                        <TextInput onChange={this.onChange}
                                   value={entry.ShipDate ? formatDate(entry.ShipDate, 'YYYY-MM-DD') : ''}
                                   field="ShipDate"
                                   type="date" required/>
                    </div>
                    <div className="col-2">Due</div>
                    <div className="col-5">
                        {!!workOrder.WODueDate &&
                        <strong>{formatDate(parseDate(workOrder.WODueDate), 'DD MMM YYYY')}</strong>}
                    </div>
                </FormGroup>
                <FormGroup colWidth={10} label="Work Order #">
                    <div className="col-3">
                        <div className="input-group input-group-sm">
                            <TextInput onChange={this.onChange} value={entry.WorkOrderNo || ''} field="WorkOrderNo"
                                       ref={this.woRef} required
                                       placeholder="Work Order #" onBlur={this.loadWorkOrder}/>
                            <div className="input-group-append">
                                <button type="button" className="btn btn-outline-secondary"
                                        onClick={this.loadWorkOrder}>
                                    Load
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-2">Item</div>
                    <div className="col-5">
                        {!!workOrder.ItemBillNumber &&
                        <strong>{workOrder.ItemBillNumber || ''} ({workOrder.ParentWhse || ''})</strong>
                        }
                    </div>
                </FormGroup>
                <FormGroup className="form-row" colWidth={10} label="Quantity">
                    <div className="col-3">
                        <TextInput onChange={this.onChange}
                                   value={entry.QuantityShipped || ''}
                                   field="QuantityShipped" type="number" required/>
                    </div>
                    <div className="col-2">Remaining</div>
                    <div className="col-5">
                        {!!workOrder.ItemBillNumber &&
                        <strong>{workOrder.QtyOrdered - workOrder.QtyComplete}</strong>
                        }
                    </div>
                </FormGroup>
                <FormGroup colWidth={10} label={' '}>
                    <div>
                        <button type="submit" className="btn btn-sm btn-primary mr-1">Save</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary mr-1"
                                onClick={this.onClickNewEntry}>
                            New Entry
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger mr-1" disabled={!entry.id}
                                onClick={this.onConfirmDelete}>
                            Delete
                        </button>
                    </div>
                </FormGroup>
                {!!entry.id && <Alert message={`Hey, are you sure you want to edit or delete sticker #${entry.id} ?`} type="danger"/>}
                {!!this.state.confirm && <ModalConfirm onCancel={this.onCancelDelete} onConfirm={this.onDeleteEntry} message={`Are you sure you want to delete entry # ${entry.id}`}/>}
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    const {entry, ShipDate, workOrder} = state;
    return {entry, ShipDate, workOrder}
};

const mapDispatchToProps = {
    setEntry,
    fetchWorkOrder,
    saveEntry,
    deleteEntry,
    newEntry,
};

export default connect(mapStateToProps, mapDispatchToProps)(EntryForm);
