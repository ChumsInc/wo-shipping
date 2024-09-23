import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {DataTableRow, SortableTable, SortProps, TablePagination} from 'chums-components';
import './manifest.css';
import {commentFields, tableFields} from "../manifest/tableFields";
import LocalStore, {CURRENT_ENTRY_ROWS} from "../../LocalStore";
import {WOManifestEntryItem} from "chums-types";
import {useAppDispatch} from "../../app/configureStore";
import {
    selectHistorySort,
    selectHistoryTotals,
    selectSearchLoading,
    selectSortedHistoryList,
    setHistorySort
} from "./index";
import HistoryFilters from "./HistoryFilters";
import LinearProgress from "@mui/material/LinearProgress";
import ManifestTotalTFoot from "../manifest/ManifestTotalTFoot";
import {PMManifestEntryItem} from "chums-types/src/production";


const ManifestPrintList = () => {
    const dispatch = useAppDispatch();
    const sort = useSelector(selectHistorySort)
    const list = useSelector(selectSortedHistoryList);
    const total = useSelector(selectHistoryTotals);
    const loading = useSelector(selectSearchLoading);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(LocalStore.getItem<number>(CURRENT_ENTRY_ROWS, 10) ?? 10);

    const sortChangeHandler = (sort: SortProps<PMManifestEntryItem>) => {
        dispatch(setHistorySort(sort));
    }

    const onChangeRowsPerPage = (value: number) => {
        LocalStore.setItem<number>(CURRENT_ENTRY_ROWS, value);
        setRowsPerPage(value);
    }

    return (
        <div>
            <HistoryFilters/>
            {loading && <LinearProgress variant="indeterminate"/>}
            <SortableTable fields={tableFields} data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           currentSort={sort} onChangeSort={sortChangeHandler}
                           renderRow={(row) => (
                               <React.Fragment key={row.id}>
                                   <DataTableRow fields={tableFields} row={row}/>
                                   {!!row.Comment?.trim() && <DataTableRow fields={commentFields} row={row}/>}
                               </React.Fragment>
                           )}
                           size="sm" keyField="id"
                           tfoot={<ManifestTotalTFoot totals={[total]} />}
            />
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={onChangeRowsPerPage}
                             showFirst showLast
                             count={list.length}/>
        </div>
    )
}

export default ManifestPrintList;
