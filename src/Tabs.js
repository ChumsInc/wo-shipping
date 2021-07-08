import React, {Component, createRef} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {TABS} from "./constants";
import {setTab} from './actions';

const Tab = ({active = false, tab, title, onSelect}) => {
    const onClick = (ev) => {
        ev.preventDefault();
        onSelect(tab);
    };
    return (
        <li className="nav-item">
            <a className={classNames('nav-link', {active})} href="#" onClick={onClick}>{title}</a>
        </li>
    );
};

const Tabs = ({tab, setTab}) => (
    <ul className="nav nav-tabs mb-2">
        <Tab active={tab === TABS.ENTRY.tab} {...TABS.ENTRY} onSelect={(tab) => setTab(tab)}/>
        <Tab active={tab === TABS.SEARCH.tab} {...TABS.SEARCH} onSelect={(tab) => setTab(tab)}/>
    </ul>
);

const mapStateToProps = (state) => {
    const {tab} = state;
    return {tab};
};
const mapDispatchToProps = {
    setTab
}
export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
