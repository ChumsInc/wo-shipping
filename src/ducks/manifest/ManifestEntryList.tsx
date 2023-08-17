import React, {Fragment, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {entryLineKey, ManifestEntry, ManifestEntrySorterProps} from "../../types";
import {
    addPageSetAction,
    ErrorBoundary,
    pagedDataSelector,
    PagerDuck,
    SortableTable,
    sortableTableSelector,
    SortableTR,
    tableAddedAction
} from 'chums-ducks';
import {defaultSort, listSelector, selectedEntrySelector} from "./index";
import {setCurrentEntry} from "./actions";
import './manifest.css';
import {commentFields, tableFields} from "./tableFields";
import ManifestTotalTFoot from "./ManifestTotalTFoot";
import LocalStore, {CURRENT_ENTRY_ROWS} from "../../LocalStore";
import {totalsReducer} from "./utils";


const TABLE_KEY = 'manifest';

const ManifestEntryList: React.FC = () => {
    const dispatch = useDispatch();
    const today = new Date().toLocaleDateString();
    const selected = useSelector(selectedEntrySelector);
    const sort = useSelector(sortableTableSelector(TABLE_KEY))
    const list = useSelector(listSelector(sort as ManifestEntrySorterProps));

    const todayList = list.filter(entry => !!entry.PackDate && new Date(entry.PackDate).toLocaleDateString() === today);
    const pagedList = useSelector(pagedDataSelector(TABLE_KEY, list));

    useEffect(() => {
        dispatch(tableAddedAction({key: TABLE_KEY, ...defaultSort}));
        dispatch(addPageSetAction({key: TABLE_KEY, rowsPerPage: LocalStore.getItem(CURRENT_ENTRY_ROWS) || 10}));
    }, []);

    const onSelect = (row: ManifestEntry) => {
        dispatch(setCurrentEntry(row));
    }

    const onChangeRowsPerPage = (value: number) => {
        LocalStore.setItem(CURRENT_ENTRY_ROWS, value);
    }

    const totals = [
        totalsReducer(todayList, "Today's Total"),
        totalsReducer(list, "Manifest Total")
    ];

    return (
        <div>
            <SortableTable tableKey={TABLE_KEY} keyField={entryLineKey} fields={tableFields} data={[]}
                           size="sm"
                           onSelectRow={onSelect}>
                <tbody>
                <ErrorBoundary>
                    {pagedList.map(row => {
                        if (!row.Comment) {
                            return <SortableTR key={row.id} fields={tableFields} row={row} onClick={() => onSelect(row)}
                                               selected={entryLineKey(row) === entryLineKey(selected)}/>
                        }
                        return (
                            <Fragment key={row.id}>
                                <SortableTR key={row.id} fields={tableFields} row={row} onClick={() => onSelect(row)}
                                            selected={entryLineKey(row) === entryLineKey(selected)}
                                            className="has-comment"/>
                                <SortableTR key={`C-${row.id}`} fields={commentFields} row={row}
                                            onClick={() => onSelect(row)}
                                            selected={entryLineKey(row) === entryLineKey(selected)}/>
                            </Fragment>
                        )
                    })}
                </ErrorBoundary>

                </tbody>
                <ManifestTotalTFoot totals={totals}/>
            </SortableTable>
            <PagerDuck pageKey={TABLE_KEY} dataLength={list.length} onChangeRowsPerPage={onChangeRowsPerPage}/>
        </div>
    )
}

export default ManifestEntryList;
