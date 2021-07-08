import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {TABS} from "./constants";
import {setTab} from './actions';
import EntryForm from "./EntryForm";
import SearchForm from "./SearchForm";

const TabbedContent = ({tab}) => (
    <Fragment>
        {tab === TABS.ENTRY.tab && <EntryForm/>}
        {tab === TABS.SEARCH.tab && <SearchForm/>}
    </Fragment>
);

const mapStateToProps = ({tab}) => {
    return {tab}
};
export default connect(mapStateToProps)(TabbedContent);
