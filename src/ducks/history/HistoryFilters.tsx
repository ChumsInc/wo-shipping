import React, {ChangeEvent, FormEvent} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {Input, InputGroup} from "chums-components";
import ShipDateSelect from "../shipDates/ShipDateSelect";
import {useSelector} from "react-redux";
import {HistorySearch, loadSearch, selectSearchParams, setSearch} from "./index";
import {selectShipDates} from "../shipDates";
import dayjs from "dayjs";

export default function HistoryFilters() {
    const dispatch = useAppDispatch();
    const search = useSelector(selectSearchParams);
    const shipDates = useSelector(selectShipDates);

    const onChangeSearch = (field: keyof Omit<HistorySearch, 'shipDate'>) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'fromDate':
            case 'toDate':
                if (ev.target.valueAsDate) {
                    const date = dayjs(ev.target.valueAsDate).add(ev.target.valueAsDate.getTimezoneOffset(), 'minutes').toISOString();
                    dispatch(setSearch({[field]: date, shipDate: ''}));
                    return;
                }
                dispatch(setSearch({[field]: '', shipDate: ''}));
                return;
            default:
                dispatch(setSearch({[field]: ev.target.value}));
        }
    }

    const onChangeShipDate = (ev: ChangeEvent<HTMLSelectElement>) => {
        if (ev.target.value) {
            const shipDate = dayjs(ev.target.value).toISOString();
            dispatch(setSearch({shipDate, fromDate: '', toDate: ''}));
            return;
        }
        dispatch(setSearch({shipDate: '', fromDate: '', toDate: ''}));
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(loadSearch(search))
    }

    return (
        <form className="mb-3 row g-3 wo--manifest-filter" onSubmit={submitHandler}>
            <div className="col-auto">
                <InputGroup bsSize="sm">
                    <div className="input-group-text">
                        <span className="bi-truck"/>
                    </div>
                    <ShipDateSelect value={search.shipDate ? dayjs(search.shipDate).toISOString() : ''} onChange={onChangeShipDate}
                                    values={shipDates}
                                    defaultLabel="Manifest Date"/>
                </InputGroup>
            </div>
            <div className="col-auto">
                <InputGroup bsSize="sm">
                    <div className="input-group-text">WT #</div>
                    <Input type="text" value={search.workTicketNo}
                           onChange={onChangeSearch('workTicketNo')}/>
                </InputGroup>
            </div>
            <div className="col-auto">
                <InputGroup bsSize="sm">
                    <div className="input-group-text">Whse</div>
                    <Input type="text" value={search.warehouseCode}
                           onChange={onChangeSearch('warehouseCode')}/>
                </InputGroup>
            </div>
            <div className="col-auto">
                <InputGroup bsSize="sm">
                    <div className="input-group-text">Item</div>
                    <Input type="text" value={search.itemCode}
                           onChange={onChangeSearch('itemCode')}/>
                </InputGroup>
            </div>
            <div className="col-auto">
                <InputGroup bsSize="sm">
                    <div className="input-group-text">SO#</div>
                    <Input type="text" value={search.salesOrderNo}
                           onChange={onChangeSearch('salesOrderNo')}/>
                </InputGroup>
            </div>
            <div className="col-auto">
                <InputGroup bsSize="sm">
                    <div className="input-group-text">From:</div>
                    <input type="date"
                           value={search.fromDate ? dayjs(search.fromDate).format('YYYY-MM-DD') : ''}
                           onChange={onChangeSearch('fromDate')}
                           className="form-control form-control-sm"/>
                </InputGroup>
            </div>
            <div className="col-auto">
                <InputGroup bsSize="sm">
                    <div className="input-group-text">To:</div>
                    <input type="date"
                           value={search.toDate ? dayjs(search.toDate).format('YYYY-MM-DD') : ''}
                           onChange={onChangeSearch('toDate')}
                           className="form-control form-control-sm"/>
                </InputGroup>
            </div>
            <div className="col-auto">
                <button type="submit" className="btn btn-sm mx-1 btn-outline-primary">
                    Load
                </button>
            </div>
        </form>
    )
}
