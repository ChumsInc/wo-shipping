import React, {ChangeEvent, Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {entryLineKey, ManifestEntrySorterProps} from "../../types";
import {
    addPageSetAction,
    ErrorBoundary,
    Input,
    InputGroup,
    pagedDataSelector,
    PagerDuck,
    SortableTable,
    sortableTableSelector,
    SortableTR,
    tableAddedAction
} from 'chums-ducks';
import {defaultSort, listSelector} from "./index";
import './manifest.css';
import {commentFields, tableFields} from "./tableFields";
import ManifestTotalTFoot from "./ManifestTotalTFoot";

const TABLE_KEY = 'print-manifest';

const ManifestPrintList: React.FC = () => {
    const dispatch = useDispatch();

    const [workOrderNo, setWorkOrderNo] = useState('');
    const [warehouseCode, setWarehouseCode] = useState('');
    const [itemCode, setItemCode] = useState('');
    const [salesOrderNo, setSalesOrderNo] = useState('');

    const sort = useSelector(sortableTableSelector(TABLE_KEY))
    const list = useSelector(listSelector(sort as ManifestEntrySorterProps));
    const filteredList = list
        .filter(wo => {
            return wo.WorkOrderNo.includes(workOrderNo)
                && wo.WarehouseCode?.toLowerCase().includes(warehouseCode.toLowerCase())
                && wo.ItemCode?.toLowerCase().includes(itemCode.toLowerCase())
                && wo.MakeFor?.toLowerCase().includes(salesOrderNo.toLowerCase())
        });

    const pagedList = useSelector(pagedDataSelector(TABLE_KEY, filteredList));

    useEffect(() => {
        dispatch(tableAddedAction({key: TABLE_KEY, field: 'id', ascending: true}));
        dispatch(addPageSetAction({key: TABLE_KEY, rowsPerPage: 25}));
    }, []);

    const onResetFilter = () => {
        setWorkOrderNo('');
        setWarehouseCode('');
        setItemCode('');
        setSalesOrderNo('');
    }

    return (
        <div>
            <form className="mb-3 row g-3">
                <div className="col-auto">
                    <InputGroup bsSize="sm">
                        <div className="input-group-text">WO #</div>
                        <Input type="text" value={workOrderNo}
                               onChange={(ev: ChangeEvent<HTMLInputElement>) => setWorkOrderNo(ev.target.value)}/>
                    </InputGroup>
                </div>
                <div className="col-auto">
                    <InputGroup bsSize="sm">
                        <div className="input-group-text">Whse</div>
                        <Input type="text" value={warehouseCode}
                               onChange={(ev: ChangeEvent<HTMLInputElement>) => setWarehouseCode(ev.target.value)}/>
                    </InputGroup>
                </div>
                <div className="col-auto">
                    <InputGroup bsSize="sm">
                        <div className="input-group-text">Item</div>
                        <Input type="text" value={itemCode}
                               onChange={(ev: ChangeEvent<HTMLInputElement>) => setItemCode(ev.target.value)}/>
                    </InputGroup>
                </div>
                <div className="col-auto">
                    <InputGroup bsSize="sm">
                        <div className="input-group-text">SO#</div>
                        <Input type="text" value={salesOrderNo}
                               onChange={(ev: ChangeEvent<HTMLInputElement>) => setSalesOrderNo(ev.target.value)}/>
                    </InputGroup>
                </div>
                <div className="col-auto">
                    <button type="reset" onClick={onResetFilter}
                            className="btn btn-sm mx-1 btn-outline-secondary">Reset
                    </button>
                </div>
            </form>

            <SortableTable tableKey={TABLE_KEY} keyField={entryLineKey} fields={tableFields} data={[]}>
                <tbody>
                <ErrorBoundary>
                    {pagedList.map(row => {
                        if (!row.Comment) {
                            return <SortableTR key={row.id} fields={tableFields} row={row}/>
                        }
                        return (
                            <Fragment key={row.id}>
                                <SortableTR key={row.id} fields={tableFields} row={row} className="has-comment"/>
                                <SortableTR key={`C-${row.id}`} fields={commentFields} row={row}/>
                            </Fragment>
                        )
                    })}
                </ErrorBoundary>
                </tbody>
                <ManifestTotalTFoot />
            </SortableTable>
            <PagerDuck pageKey={TABLE_KEY} dataLength={list.length}/>
        </div>
    )
}

export default ManifestPrintList;
