import React, {Component} from 'react';
import {Provider} from 'react-redux';
import AlertList from "./AlertList";
import ManifestSelector from "./ManifestSelector";
import Manifest from "./Manifest";
import EntryForm from "./EntryForm";
import Tabs from "./Tabs";
import {TABS} from "./constants";
import TabbedContent from "./TabbedContent";

export default class App extends Component {

    render() {
        const {store} = this.props;
        const {tab} = store.getState();
        return (
            <Provider store={store}>
                <div className="container">
                    <AlertList/>
                    <ManifestSelector/>
                    <Tabs />
                    <TabbedContent />
                    <Manifest/>
                </div>
            </Provider>
        );
    }
};
