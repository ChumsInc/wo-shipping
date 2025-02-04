import React from "react";
import numeral from "numeral";
import {SortableTableField} from "chums-components";
import Tooltip from '@mui/material/Tooltip';
import {PMManifestEntryItem} from "chums-types/src/production";
import {formatDate} from "./utils";

interface CommentIconProps {
    comment?: string
}

const CommentIcon = ({comment}: CommentIconProps) => {
    if (!comment || !comment.trim()) {
        return null;
    }
    return (
        <Tooltip title={comment}>
            <span className={!!comment ? 'bi-chat-square-text-fill text-danger' : ''}/>
        </Tooltip>
    )
}

export const tableFields: SortableTableField<PMManifestEntryItem>[] = [
    {field: 'id', title: 'ID', sortable: true},
    {
        field: 'WorkTicketNo',
        title: 'Work Ticket',
        sortable: true,
        render: (row) => row.WorkTicketNo?.replace(/^0+/, '') ?? ''
    },
    {field: 'WarehouseCode', title: 'Whse', sortable: true},
    {field: 'ItemCode', title: 'Item', sortable: true},
    {field: 'ItemCodeDesc', title: 'Description', sortable: true},
    {
        field: 'QuantityShipped',
        title: 'Qty Shipped',
        sortable: true,
        className: 'right',
        render: (row) => numeral(row.QuantityShipped).format('0,0')
    },
    {
        field: 'QuantityOrdered',
        title: 'Qty Ordered',
        sortable: true,
        className: 'right',
        render: (row) => numeral(row.QuantityOrdered).format('0,0')
    },
    {
        field: 'ProductionDueDate',
        title: 'Due',
        sortable: true,
        className: 'center',
        render: (row) => !row.ProductionDueDate ? null : formatDate(row.ProductionDueDate)
    },
    {
        field: 'PackDate',
        title: 'Packed',
        sortable: true,
        className: 'center',
        render: (row) => !row.PackDate ? null : formatDate(row.PackDate),
    },
    {
        field: 'ShipDate', title: 'Ship', sortable: true, className: 'center',
        render: (row) => formatDate(row.ShipDate)
    },
    {field: 'MakeFor', title: 'For', sortable: true},
    {field: 'BinLocation', title: 'Bin Location', sortable: true},
    {
        field: 'Comment',
        title: <span className="bi-chat-square-text" title="Comments"/>,
        align: 'end',
        sortable: true,
        render: ({Comment}) => <CommentIcon comment={Comment}/>
    }
];

export const commentFields: SortableTableField<PMManifestEntryItem>[] = [
    {field: 'id', title: 'ID', render: () => ''},
    {field: 'WorkTicketNo', title: 'Work Order', render: () => ''},
    {field: 'Comment', title: 'Comment', colSpan: 11, className: 'text-danger'},
]
