import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AlertList, ErrorBoundary, selectedTabSelector, Tab, TabList, tabListCreatedAction} from 'chums-ducks';
import ManifestSelector from "./ManifestSelector";
import {fetchShipDatesAction} from "../ducks/shipDates/actions";
import EntryForm from "../ducks/manifest/EntryForm";
import ManifestEntryList from "../ducks/manifest/ManifestEntryList";
import LocalStore from "../LocalStore";
import {CURRENT_TAB} from "../constants";
import ManifestPrintList from "../ducks/manifest/ManifestPrintList";

const tabs: Tab[] = [
    {id: 'entry', title: 'Shipping Entry'},
    {id: 'lookup', title: 'Manifest Lookup'},
];

const TAB_KEY = 'wo-shipping';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const currentTab = useSelector(selectedTabSelector(TAB_KEY));

    useEffect(() => {
        dispatch(fetchShipDatesAction());
        dispatch(tabListCreatedAction(tabs, TAB_KEY, LocalStore.getItem(CURRENT_TAB) || 'entry'));
    }, [])

    const onSelectTab = (id?: string) => {
        LocalStore.setItem(CURRENT_TAB, id)
    }

    return (
        <div className="container-lg">
            <AlertList/>
            <ManifestSelector/>
            <TabList tabKey={TAB_KEY} className="mt-3 mb-1" onSelectTab={onSelectTab}/>
            <ErrorBoundary>
                {currentTab === 'entry' && <EntryForm/>}
                {currentTab === 'entry' && <ManifestEntryList/>}
                {currentTab === 'lookup' && <ManifestPrintList/>}
            </ErrorBoundary>

        </div>
    )
}

export default App;
