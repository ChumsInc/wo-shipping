import React, {Component, Fragment} from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import Pagination from "./Pagination";
import RowsPerPage from "./RowsPerPage";
import FormGroup from "./FormGroup";
import ThSortable from "./ThSortable";

export const filterPage = (page, rowsPerPage) => (row, index) => Math.ceil((index + 1) / rowsPerPage) === page;
export const calcPages = (countRows, rowsPerPage) => Math.ceil(countRows / rowsPerPage);

class SortableTableFooter extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            render: PropTypes.func,
            className: PropTypes.string,
        })),
        footerData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        page: PropTypes.number,
        pages: PropTypes.number,
        onNextPage: PropTypes.func.isRequired,
    };

    static defaultProps = {
        fields: [],
        footerData: {},
    };

    render() {
        const {page, pages, fields, footerData} = this.props;
        const _footerData = !Array.isArray(footerData) ? [footerData] : footerData;
        return (
            <tfoot>
            {page < pages && (
                <tr>
                    <td colSpan={fields.length} className="align-content-center next-page-link"
                        title="Click for next page"
                        onClick={this.props.onNextPage}>...
                    </td>
                </tr>
            )}
            {_footerData.map((fd, index) => (
                <tr key={index}>
                    {fields.map(({field, render, className = ''}) => (
                        <td key={field}
                            className={className}>{fd[field] !== undefined ? (!!render ? render(fd) : fd[field]) : ' '}</td>
                    ))}
                </tr>
            ))}
            </tfoot>
        );
    }
}

class SortableTableHeader extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            title: PropTypes.string,
            noSort: PropTypes.bool,
            className: PropTypes.string,
        })),
        sort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }),

        onClickSort: PropTypes.func,
    };

    static defaultProps = {
        fields: [],
        sort: {
            field: '',
            asc: true
        },
    };

    render() {
        const {fields, sort} = this.props;
        return (
            <thead>
            <tr>
                {fields.map(({field, title = null, noSort = false, className = ''}) => (
                    <ThSortable key={field} currentSort={sort} onClick={this.props.onClickSort}
                                className={className}
                                field={field} noSort={noSort}>
                        {title || field}
                    </ThSortable>)
                )}
            </tr>
            </thead>
        );
    }
}

export default class SortableTable extends Component {
    static propTypes = {
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            title: PropTypes.string,
            noSort: PropTypes.bool,
            render: PropTypes.func,
            className: PropTypes.string,
            sortFn: PropTypes.function,
        })),
        data: PropTypes.array.isRequired,
        hasFooter: PropTypes.bool,
        footerData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        keyField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        selected: PropTypes.any,
        hasPageIndicators: PropTypes.bool,
        onSelect: PropTypes.func,
        sorter: PropTypes.func,
        defaultSort: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool
        })]),
        sort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }),
        page: PropTypes.number,
        rowsPerPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        filtered: PropTypes.bool,
        rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        paginationClassName: PropTypes.string,
        paginationInline: PropTypes.bool,

        ensureSelectedVisible: PropTypes.bool,

        onChangeSort: PropTypes.func,
        onChangePage: PropTypes.func,
        onChangeRowsPerPage: PropTypes.func,
    };

    static defaultProps = {
        className: '',
        fields: [],
        data: [],
        hasFooter: false,
        footerData: {},
        keyField: 'id',
        hasPageIndicators: true,
        defaultSort: '',
        sort: {
            field: '',
            asc: true
        },
        page: 1,
        rowsPerPage: 25,
        filtered: false,
        rowClassName: '',
        paginationClassName: '',
        paginationInline: true,
    };

    state = {
        sort: {
            field: '',
            asc: true,
        },
        page: 1,
        perPage: 25,
        pages: 0,
    };

    constructor(props) {
        super(props);
        this.onClickSort = this.onClickSort.bind(this);
        this.onSelectRow = this.onSelectRow.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.sorter = this.sorter.bind(this);
        this.onClickNextPage = this.onClickNextPage.bind(this);
    }

    componentDidMount() {
        const {defaultSort} = this.props;
        if (typeof defaultSort === 'object') {
            this.setState({sort: defaultSort});
        } else {
            this.setState({sort: {field: defaultSort, asc: true}});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data.length !== prevProps.data.length || this.props.rowsPerPage !== prevProps.rowsPerPage) {
            const pages = calcPages(this.props.data.length, this.props.rowsPerPage);
            this.setState({pages});
        }
    }


    onClickSort(nextField) {
        const {sort} = this.state;
        if (sort.field === nextField) {
            sort.asc = !sort.asc;
            this.setState({sort});
        } else {
            this.setState({sort: {field: nextField, asc: true}});
        }
        this.props.onChangeSort(nextField);
    }

    onSelectRow(row) {
        if (this.props.onSelect) {
            this.props.onSelect(row);
        }
    }

    handlePageChange(page) {
        this.props.onChangePage(page);
    }

    onClickNextPage() {
        if (this.props.page < this.state.pages) {
            this.handlePageChange(this.props.page + 1);
        }
    }

    sorter(list) {
        const {field, asc} = this.state.sort;
        const {fields, sorter} = this.props;
        if (typeof sorter === 'function') {
            return sorter({list, field, asc});
        }
        const [{sortFn} = {}] = fields.filter(f => f.field === field);
        return list.sort((a, b) => {
            const aa = sortFn ? sortFn(a) : (typeof (a[field]) === 'number' ? a[field] : String(a[field]).toLowerCase());
            const bb = sortFn ? sortFn(b) : (typeof (b[field]) === 'number' ? b[field] : String(b[field]).toLowerCase());
            return (aa === bb ? 0 : (aa > bb ? 1 : -1)) * (asc ? 1 : -1);
        })
    }


    render() {
        const {
            fields, data, className, page, rowsPerPage, keyField, filtered, selected, hasFooter, footerData,
            paginationClassName, paginationInline, hasPageIndicators, ensureSelectedVisible
        } = this.props;
        const {sort, pages} = this.state;
        const rows = this.sorter(data);
        // const pages = calcPages(rows.length, rowsPerPage);

        return (
            <Fragment>
                <table className={classNames("table table-sm table-hover table-sortable table-sticky", className)}>
                    <SortableTableHeader fields={fields} sort={sort} onClickSort={this.onClickSort}/>
                    {!!hasFooter &&
                    <SortableTableFooter fields={fields} footerData={footerData} page={page} pages={pages}
                                         onNextPage={this.onClickNextPage}/>}
                    <tbody>
                    {rows
                        .filter(filterPage(page, rowsPerPage))
                        .map((row, index) => {
                            const key = typeof keyField === "function" ? keyField(row) : (row[keyField] || index);
                            const rowClassName = typeof this.props.rowClassName === 'function'
                                ? this.props.rowClassName(row)
                                : this.props.rowClassName;
                            const className = {
                                'table-active': key === selected,
                            };
                            return (
                                <tr key={key} onClick={() => this.onSelectRow(row)}
                                    className={classNames(rowClassName, className)}>
                                    {fields.map((field, index) => {
                                        if (typeof field.render === 'function') {
                                            return (
                                                <td key={index} className={field.className}>{field.render(row)}</td>);
                                        }
                                        return (<td key={index} className={field.className}>{row[field.field] === null ?
                                            <span className="null-content">&#x2400;</span> : row[field.field]}</td>);
                                    })}
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                {!!hasPageIndicators && (rows.length > 0 || filtered) && (
                    <div className={classNames("page-display", {'form-inline': paginationInline})}>
                        {!!this.props.onChangeRowsPerPage && (
                            <RowsPerPage value={rowsPerPage} onChange={this.props.onChangeRowsPerPage}/>
                        )}
                        {(pages > 1 || !!this.props.onChangeRowsPerPage) && (
                            <FormGroup label="Pages" inline={true}>
                                <Pagination activePage={page} pages={pages}
                                            className={paginationClassName}
                                            onSelect={this.handlePageChange}
                                            filtered={filtered}/>
                                {rows.length === 0 && <strong className="ml-3">No records.</strong>}
                            </FormGroup>
                        )}
                    </div>
                )}
                {rows.length === 0 && !filtered && (<strong>No records found</strong>)}
            </Fragment>
        );
    }
}
