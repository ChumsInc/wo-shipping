import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {DataTableRow, SortableTable, SortProps, TablePagination} from 'chums-components';
import {setCurrentEntry, setListSort} from "./actions";
import '../history/manifest.css';
import {commentFields, tableFields} from "./tableFields";
import ManifestTotalTFoot from "./ManifestTotalTFoot";
import LocalStore, {CURRENT_ENTRY_ROWS} from "../../LocalStore";
import {
    selectCurrentDayManifestTotals,
    selectCurrentEntry,
    selectFilteredList,
    selectManifestListSort,
    selectManifestTotals
} from "./selectors";
import {useAppDispatch} from "../../app/configureStore";
import {PMManifestEntry, PMManifestEntryItem} from "chums-types/src/production";

const ManifestEntryList: React.FC = () => {
    const dispatch = useAppDispatch();
    const current = useSelector(selectCurrentEntry);
    const sort = useSelector(selectManifestListSort)
    const list = useSelector(selectFilteredList);
    const total = useSelector(selectManifestTotals);
    const todayTotal = useSelector(selectCurrentDayManifestTotals);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(LocalStore.getItem<number>(CURRENT_ENTRY_ROWS, 10) ?? 10);


    const sortChangeHandler = (sort: SortProps<PMManifestEntryItem>) => {
        dispatch(setListSort(sort));
    }
    const onSelect = (row: PMManifestEntry) => {
        console.log(row);
        dispatch(setCurrentEntry(row));
    }

    const onChangeRowsPerPage = (value: number) => {
        LocalStore.setItem<number>(CURRENT_ENTRY_ROWS, value);
        setRowsPerPage(value);
    }

    return (
        <div>
            <SortableTable fields={tableFields} data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           currentSort={sort} onChangeSort={sortChangeHandler}
                           selected={row => row.id === current.id}
                           size="sm" keyField="id"
                           renderRow={(row) => (
                               <React.Fragment key={row.id}>
                                   <DataTableRow fields={tableFields} row={row} onClick={() => onSelect(row)}
                                                 selected={row.id === current?.id}/>
                                   {row.Comment && <DataTableRow fields={commentFields} row={row}/>}
                               </React.Fragment>
                           )} tfoot={<ManifestTotalTFoot totals={[todayTotal, total]}/>}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={onChangeRowsPerPage}
                             showFirst showLast
                             count={list.length}/>
        </div>
    )
}

export default ManifestEntryList;
