import React, {ChangeEvent, createRef, FormEvent, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import formatDate from "date-fns/format";
import parseISO from "date-fns/parseISO";
import {loadWorkTicket, removeManifestEntry, saveManifestEntry, setNewEntry, updateCurrentEntry} from "./actions";
import {Alert, FormColumn, Input, InputGroup, SpinnerButton} from "chums-components";
import {selectCurrentShipDate} from "../shipDates";
import {useAppDispatch} from "../../app/configureStore";
import {selectCurrentEntry, selectCurrentLoading, selectCurrentWorkTicket} from "./selectors";
import {WOManifestEntry} from "chums-types/src/work-order";
import {TextareaAutosize} from "@mui/base";
import ManifestSelector from "./ManifestSelector";
import {selectCanEdit, selectCanEnter} from "../permissions";
import dayjs from "dayjs";
import {PMManifestEntry} from "chums-types/src/production";



const EntryForm = () => {
    const dispatch = useAppDispatch();
    const shipDate = useSelector(selectCurrentShipDate);
    const currentEntry = useSelector(selectCurrentEntry);
    const workOrder = useSelector(selectCurrentWorkTicket);
    const loading = useSelector(selectCurrentLoading);
    const woRef = createRef<HTMLInputElement>();
    const canEnter = useSelector(selectCanEnter);
    const canEdit = useSelector(selectCanEdit);

    const [readOnly, setReadOnly] = useState(!canEnter || (!!shipDate && dayjs().endOf('day').isAfter(shipDate)));
    useEffect(() => {
        setReadOnly(!canEnter || (!!shipDate && dayjs().endOf("day").isAfter(shipDate)));
    }, [shipDate, canEnter]);

    const today = dayjs();

    const onChangeShipDate = (ev: ChangeEvent<HTMLInputElement>) => {
        //date from input does not have the current timezone offset
        const value = ev.target.valueAsDate
            ? new Date(ev.target.valueAsDate.valueOf() + new Date().getTimezoneOffset() * 60 * 1000).toISOString()
            : '';
        dispatch(updateCurrentEntry({ShipDate: value}));
    }

    const entryChangeHandler = (field: keyof PMManifestEntry) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'ShipDate':
            case 'id':
                return;
            case 'QuantityShipped':
                dispatch(updateCurrentEntry({[field]: ev.target.valueAsNumber ?? 0}));
                return;
            default:
                dispatch(updateCurrentEntry({[field]: ev.target.value}));
                return;
        }
    }

    const onChangeComment = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(updateCurrentEntry({Comment: ev.target.value}));
    }

    const onLoadWorkTicket = () => {
        if (!currentEntry.WorkTicketNo) {
            return;
        }
        if (!!shipDate && dayjs().endOf('day').isAfter(shipDate)) {
            return;
        }
        dispatch(loadWorkTicket(currentEntry.WorkTicketNo));
    }


    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (readOnly && !canEdit) {
            return;
        }
        if (!currentEntry.id && currentEntry.WorkTicketNo && !currentEntry.ItemCode) {
            dispatch(loadWorkTicket(currentEntry.WorkTicketNo));
            return;
        }
        dispatch(saveManifestEntry(currentEntry));
        woRef.current?.focus();
    }

    const onNewWorkOrder = () => {
        dispatch(setNewEntry());
        woRef.current?.focus();
    }

    const onConfirmDelete = async () => {
        if (readOnly || !currentEntry.id) {
            return;
        }
        if (window.confirm('Are you sure you want to delete this entry?')) {
            await dispatch(removeManifestEntry(currentEntry));
            dispatch(setNewEntry());
        }
        woRef.current?.focus();
    }


    const inputDate = (date?: string) => !date ? '' : formatDate(new Date(date), 'yyyy-MM-dd');


    return (
        <form className="mb-3" onSubmit={onSubmit}>
            <div className="row g-3">
                <div className="col-6">
                    <FormColumn label="Ship Date" width={8}>
                        <InputGroup bsSize="sm">
                            <Input type="date" value={inputDate(currentEntry.ShipDate)} onChange={onChangeShipDate}
                                   readOnly={!!currentEntry.id && readOnly}/>
                            <div className="input-group-text">
                                {currentEntry.ShipDate ? new Date(currentEntry.ShipDate).toLocaleDateString(undefined, {weekday: 'short'}) : 'N/A'}
                            </div>
                        </InputGroup>
                    </FormColumn>
                    <FormColumn label="Work Ticket #" width={8}>
                        <InputGroup bsSize="sm">
                            <Input type="text" value={currentEntry.WorkTicketNo || ''}
                                   onChange={entryChangeHandler('WorkTicketNo')}
                                   placeholder="WO #"
                                   onBlur={onLoadWorkTicket} myRef={woRef} readOnly={readOnly}
                                   maxLength={7}/>
                            <SpinnerButton spinning={loading} onClick={onLoadWorkTicket} type="button"
                                           tabIndex={-1} color="secondary">
                                <span className="bi-search"/>
                            </SpinnerButton>
                        </InputGroup>
                        {workOrder?.WorkTicketStatus === 'C' && <Alert color="danger">Work Order {workOrder.WorkTicketNo} is closed.</Alert>}
                    </FormColumn>
                    <FormColumn label="Quantity" width={8}>
                        <input type="number" className="form-control form-control-sm"
                               readOnly={readOnly}
                               required
                               value={currentEntry.QuantityShipped || ''} onChange={entryChangeHandler('QuantityShipped')}/>
                    </FormColumn>
                    <FormColumn label="Comment" width={8}>
                        <TextareaAutosize value={currentEntry.Comment || ''} minRows={2} maxRows={4}
                                          className="form-control form-control-sm"
                                          readOnly={readOnly && !canEdit}
                                          onChange={onChangeComment}/>
                    </FormColumn>
                </div>
                <div className="col-6">
                    <FormColumn label="Item Code" width={8}>
                        <input type="text" className="form-control form-control-sm"
                               value={currentEntry.ItemCode ?? ''} onChange={entryChangeHandler('ItemCode')}
                               readOnly={readOnly || !!currentEntry.WorkTicketNo} disabled={!!currentEntry.WorkTicketNo} />
                    </FormColumn>
                    <FormColumn label="Whse Code" width={8}>
                        <input type="text" className="form-control form-control-sm"
                               value={currentEntry.WarehouseCode ?? ''} onChange={entryChangeHandler('WarehouseCode')}
                               maxLength={3}
                               readOnly={readOnly || !!currentEntry.WorkTicketNo} disabled={!!currentEntry.WorkTicketNo} />
                    </FormColumn>
                    {(!readOnly || canEdit) && !!currentEntry.id && (
                        <Alert color="warning" className="mt-1">
                            <strong className="me-1">Hey!</strong> Editing entry #{currentEntry.id}?
                        </Alert>
                    )}
                </div>
            </div>
            <div className="row g-3 align-items-baseline">
                <div className="col-6">
                    <FormColumn label="" width={8} className="mt-1">
                        <div className="row g-3">
                            <div className="col-auto">
                                <button type="submit" className="btn btn-sm btn-primary mr-1" disabled={readOnly && !canEdit}>Save</button>
                            </div>
                            <div className="col-auto">
                                <button type="button" className="btn btn-sm btn-outline-secondary mr-1"
                                        disabled={readOnly}
                                        onClick={onNewWorkOrder}>
                                    New Entry
                                </button>

                            </div>
                            <div className="col-auto">
                                <button type="button" className="btn btn-sm btn-outline-danger mr-1"
                                        disabled={!currentEntry.id || readOnly}
                                        onClick={onConfirmDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </FormColumn>
                </div>
                <div className="col"></div>
                <ManifestSelector />
            </div>
        </form>
    )
}
export default EntryForm;
