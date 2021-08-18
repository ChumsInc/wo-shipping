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
import {selectEntryAction} from "./actions";
import './manifest.css';
import {commentFields, tableFields} from "./tableFields";


const TABLE_KEY = 'manifest';

const ManifestEntryList: React.FC = () => {
    const dispatch = useDispatch();


    const selected = useSelector(selectedEntrySelector);
    const sort = useSelector(sortableTableSelector(TABLE_KEY))
    const list = useSelector(listSelector(sort as ManifestEntrySorterProps));
    const pagedList = useSelector(pagedDataSelector(TABLE_KEY, list));
    useEffect(() => {
        dispatch(tableAddedAction({key: TABLE_KEY, ...defaultSort}));
        dispatch(addPageSetAction({key: TABLE_KEY, rowsPerPage: 10}));
    }, []);

    const onSelect = (row: ManifestEntry) => {
        dispatch(selectEntryAction(row));
    }

    return (
        <div>
            <SortableTable tableKey={TABLE_KEY} keyField={entryLineKey} fields={tableFields} data={[]}
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
            </SortableTable>
            <PagerDuck pageKey={TABLE_KEY} dataLength={list.length}/>
        </div>
    )
}

export default ManifestEntryList;
