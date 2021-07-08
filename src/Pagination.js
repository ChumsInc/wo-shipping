/**
 * Created by steve on 3/29/2017.
 */

import React, { Component, PureComponent, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


const PAGE_LABELS = {
    first: '«',
    prev: '‹',
    ellipsis: '…',
    next: '›',
    last: '»'
};

const DEFAULT_MAX_PAGES = 5;

const CurrentPageButton = ({page, label = null}) => {
    return (
        <li className={classNames('page-item active')}>
            <span className="page-link">{label || page}</span>
        </li>
    )
};

const SelectablePageButton = ({page, label = null, disabled = false, onClick}) => {
    const handleClick = (ev) => {
        ev.preventDefault();
        onClick(page);
    };
    return (
        <li className={classNames('page-item', {disabled: disabled})}>
            <a href="#" className='page-link' onClick={handleClick}>{label || page}</a>
        </li>
    )
};

const PageButton = ({page, label = '', disabled = false, isCurrent = false, onClick}) => {
    return (
        isCurrent
            ? <CurrentPageButton page={page} label={label} />
            : <SelectablePageButton page={page} label={label} disabled={disabled} onClick={onClick}/>
    )
};

export default class Pagination extends Component {
    static propTypes = {
        first: PropTypes.bool,
        prev: PropTypes.bool,
        next: PropTypes.bool,
        last: PropTypes.bool,
        ellipsis: PropTypes.bool,
        maxButtons: PropTypes.number,
        activePage: PropTypes.number.isRequired,
        pages: PropTypes.number.isRequired,
        onSelect: PropTypes.func.isRequired,
        filtered: PropTypes.bool,
    };

    static defaultProps = {
        first: true,
        prev: true,
        next: true,
        last: true,
        ellipsis: true,
        maxButtons: DEFAULT_MAX_PAGES,
        activePage: 1
    };

    constructor() {
        super();
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(page) {

        if (page < 1 || page > this.props.pages) {
            return;
        }
        this.props.onSelect(page);
    }

    render() {
        const {maxButtons = DEFAULT_MAX_PAGES, activePage, pages, first, prev, ellipsis, last, next, filtered } = this.props;
        if (pages === 0) {
            return null;
        }
        const hasMore = pages > maxButtons;

        let renderPages = [];
        const minPage = Math.ceil(maxButtons / 2);
        const maxPage = pages - Math.floor(maxButtons / 2);
        const beforeRender = Math.min(activePage - minPage, pages - maxButtons);
        const afterRender = Math.max(activePage + minPage, maxButtons + 1);
        for (let i = 1; i <= pages; i += 1) {
            if (i > beforeRender && i < afterRender) {
                renderPages.push(i);
            }
        }

        const showLastPage = last && activePage < maxPage;
        const hasTrailingEllipses = ellipsis && activePage < maxPage && !(showLastPage && maxPage - 1 === activePage);

        // debug('render()', {maxPage, beforeRender, afterRender, page, pages});
        //@TODO: Remove debug before live.

        return (
            <nav aria-label="Page Navigation">
                <ul className={classNames("pagination", {filtered})}>
                    {first && hasMore && <PageButton page={1} label={PAGE_LABELS.first}
                                                     onClick={this.onSelect}
                                                     disabled={activePage === 1} />}
                    {prev && hasMore && <PageButton page={activePage - 1} label={PAGE_LABELS.prev}
                                                    disabled={activePage <= 1} onClick={this.onSelect}/>}
                    {ellipsis && hasMore && activePage > minPage && <PageButton page={0} label={PAGE_LABELS.ellipsis} disabled={true}/>}
                    {renderPages.map(p => (
                        <PageButton key={p} page={p} isCurrent={p === activePage} onClick={this.onSelect}/>
                    ))}
                    {hasTrailingEllipses && <PageButton page={0} label={PAGE_LABELS.ellipsis} disabled={true}/>}
                    {last && hasMore && activePage < maxPage && <PageButton page={pages} label={pages} onClick={this.onSelect}/>}
                    {next && hasMore && <PageButton page={activePage + 1} label={PAGE_LABELS.next}
                                                    onClick={this.onSelect}
                                                    disabled={activePage === pages}/>}
                    {last && hasMore && <PageButton page={pages} label={PAGE_LABELS.last}
                                                    onClick={this.onSelect}
                                                    disabled={activePage === pages}/>}
                </ul>
            </nav>
        )
    }
}
