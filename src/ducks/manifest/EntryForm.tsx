import React, {ChangeEvent, createRef, FormEvent, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import formatDate from "date-fns/format";
import parseISO from "date-fns/parseISO";
import {loadingWorkOrderSelector, newEntry, workOrderSelector} from "./index";
import {entryChangedAction, loadWorkOrder, removeManifestEntry, saveManifestEntry, setCurrentEntry} from "./actions";
import {Alert, FormColumn, Input, InputGroup, SpinnerButton, TextArea} from "chums-ducks";
import {selectCurrentShipDate} from "../shipDates";
import {useAppDispatch} from "../../app/configureStore";
import {selectCurrentEntry} from "./selectors";
import {ManifestEntry} from "../../types";
import {Editable} from "chums-types/src/generics";
import dayjs from "dayjs";


const EntryForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const shipDate = useSelector(selectCurrentShipDate);
    const currentEntry = useSelector(selectCurrentEntry);
    const workOrder = useSelector(workOrderSelector);
    const workOrderLoading = useSelector(selec);
    const woRef = createRef<HTMLInputElement>();

    const [entry, setEntry] = useState<(ManifestEntry & Editable) | null>(null);
    useEffect(() => {
        if (!!shipDate && currentEntry?.ShipDate !== shipDate) {
            setEntry({...newEntry, ShipDate: shipDate});
        } else {
            setEntry(currentEntry);
        }
        woRef.current?.focus();
    }, [shipDate, currentEntry]);


    const thisWeek = formatDate(new Date(), 'yyyy-ww');
    const shipWeek = formatDate(parseISO(shipDate ?? ''), 'yyyy-ww');
    const readOnly = shipWeek < thisWeek;

    const onChangeShipDate = (ev: ChangeEvent<HTMLInputElement>) => {
        //date from input does not have the current timezone offset
        const value = ev.target.valueAsDate
            ? new Date(ev.target.valueAsDate.valueOf() + new Date().getTimezoneOffset() * 60 * 1000).toISOString()
            : '';
        dispatch(entryChangedAction({ShipDate: value}));
    }

    const onChangeWorkOrder = (ev: ChangeEvent<HTMLInputElement>) => {
        if (!entry) {
            return;
        }
        setEntry({...entry, WorkOrderNo: ev.target.value, changed: true});
    }

    const onChangeQty = (ev: ChangeEvent<HTMLInputElement>) => {
        if (!entry) {
            return;
        }
        setEntry({...entry, QuantityShipped: Number(ev.target.value || 0), changed: true});
    }
    const onChangeComment = (ev: ChangeEvent<HTMLInputElement>) => {
        if (!entry) {
            return;
        }
        setEntry({...entry, Comment: ev.target.value, changed: true});
    }
    const onLoadWorkOrder = () => {
        if (!entry || !entry.WorkOrderNo) {
            return;
        }
        dispatch(loadWorkOrder(entry.WorkOrderNo));
    }


    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (readOnly || !entry) {
            return;
        }
        dispatch(saveManifestEntry(entry));
        woRef.current?.focus();
    }

    const onNewWorkOrder = () => {
        setCurrentEntry({...newEntry, ShipDate: shipDate});
        woRef.current?.focus();
    }

    const onConfirmDelete = () => {
        if (readOnly || !entry) {
            return;
        }
        if (window.confirm('Are you sure you want to delete this entry?')) {
            dispatch(removeManifestEntry(entry));
        }
        woRef.current?.focus();
    }


    const inputDate = (date?: string) => !date ? '' : formatDate(new Date(date), 'yyyy-MM-dd');


    return (
        <form className="mb-3" onSubmit={onSubmit}>
            <FormColumn width={10} label="Ship Date">
                <div className="row g-3">
                    <div className="col-lg-3 col-5">
                        <InputGroup bsSize="sm">
                            <Input type="date" value={inputDate(entry.ShipDate)} onChange={onChangeShipDate}
                                   readOnly={!!entry.id && readOnly}/>
                            <div
                                className="input-group-text">{entry.ShipDate ? new Date(entry.ShipDate).toLocaleDateString(undefined, {weekday: 'short'}) : 'N/A'}</div>
                        </InputGroup>
                    </div>
                    <label className="col-2 text-end">Due</label>
                    <div className="col-lg-6 col-5">
                        {!!workOrder?.WODueDate && (
                            <strong>{formatDate(parseISO(workOrder.WODueDate), 'dd MMM yyyy')}</strong>
                        )}
                    </div>
                </div>
            </FormColumn>
            <FormColumn width={10} label="Work Order #">
                <div className="row g-3">
                    <div className="col-lg-3 col-5">
                        <div className="input-group input-group-sm">
                            <InputGroup bsSize="sm">
                                <Input type="text" value={entry.WorkOrderNo || ''} onChange={onChangeWorkOrder}
                                       placeholder="WO #" wait={100}
                                       onBlur={onLoadWorkOrder} required myRef={woRef} readOnly={readOnly}
                                       maxLength={7}/>
                                <SpinnerButton spinning={workOrderLoading} onClick={onLoadWorkOrder} type="button"
                                               tabIndex={-1} color="secondary">
                                    <span className="bi-search"/>
                                </SpinnerButton>
                            </InputGroup>
                        </div>
                    </div>
                    <div className="col-2 text-end">Item</div>
                    <div className="col-lg-6 col-5">
                        {!!workOrder && (
                            <strong>{workOrder.ItemBillNumber || ''} ({workOrder.ParentWhse || 'WO Not Found'})</strong>
                        )}
                    </div>
                </div>
            </FormColumn>
            <FormColumn width={10} label="Quantity">
                <div className="row g-3">
                    <div className="col-lg-3 col-5">
                        <Input type="number" value={entry.QuantityShipped || ''} readOnly={readOnly} wait={0}
                               min={1} required
                               onChange={onChangeQty}/>
                    </div>
                    <div className="col-2 text-end">Remaining {workOrder?.Status === 'C' ? '(Closed)' : ''}</div>
                    <div className="col-lg-6 col-5">
                        {!!workOrder?.ItemBillNumber && (
                            <strong>{workOrder.QtyOrdered - workOrder.QtyComplete}</strong>
                        )}

                    </div>
                </div>
            </FormColumn>
            <FormColumn width={10} label="Comment">
                <div className="row g-3">
                    <div className="col-lg-6 col">
                        <TextArea value={entry.Comment || ''}
                                  readOnly={readOnly}
                                  onChange={onChangeComment}/>
                    </div>
                </div>
            </FormColumn>
            <FormColumn width={10} label={' '} className="mt-1">
                <div className="row g-1  align-items-baseline">
                    <div className="col-auto">
                        <button type="submit" className="btn btn-sm btn-primary mr-1" disabled={readOnly}>Save</button>
                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-sm btn-outline-secondary mr-1"
                                onClick={onNewWorkOrder}>
                            New Entry
                        </button>

                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-sm btn-outline-danger mr-1"
                                disabled={!entry.id || readOnly}
                                onClick={onConfirmDelete}>
                            Delete
                        </button>
                    </div>
                    <div className="col-auto">
                        {!!entry.id && (
                            <Alert title={"Hey!"}
                                   message={`Are you sure you want to edit or delete entry #${entry.id}?`}
                                   color="warning" className="mt-0"/>
                        )}
                    </div>
                </div>
            </FormColumn>
        </form>
    )
}
export default EntryForm;
