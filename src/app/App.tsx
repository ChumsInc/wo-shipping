import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ManifestSelector from "../components/ManifestSelector";
import EntryForm from "../ducks/manifest/EntryForm";
import ManifestEntryList from "../ducks/manifest/ManifestEntryList";
import LocalStore, {CURRENT_TAB} from "../LocalStore";
import ManifestPrintList from "../ducks/manifest/ManifestPrintList";
import {Tab, TabList} from "chums-components";
import {useAppDispatch} from "./configureStore";
import AlertList from "../ducks/alerts/AlertList";
import {ErrorBoundary} from "react-error-boundary";
import Fallback from "./Fallback";

const tabs: Tab[] = [
    {id: 'entry', title: 'Shipping Entry'},
    {id: 'lookup', title: 'Manifest Lookup'},
];

const TAB_KEY = 'wo-shipping';

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    const [tab, setTab] = useState<Tab|null>(null);

    useEffect(() => {
        const id = LocalStore.getItem<string>(CURRENT_TAB, tabs[0].id)
        const [tab] = tabs.filter(t => t.id === id);
        setTab(tab ?? tabs[0]);
    }, []);

    useEffect(() => {
        dispatch(fetchShipDatesAction());
    }, [])

    const onSelectTab = (tab: Tab) => {
        LocalStore.setItem(CURRENT_TAB, tab.id);
        setTab(tab)
    }

    return (
        <div className="container-lg">
            <AlertList/>
            <ManifestSelector/>
            <TabList className="mt-3 mb-1" onSelectTab={onSelectTab}/>
            <ErrorBoundary FallbackComponent={Fallback}>
                {tab?.id === 'entry' && <EntryForm/>}
                {tab?.id === 'entry' && <ManifestEntryList/>}
                {tab?.id === 'lookup' && <ManifestPrintList/>}
            </ErrorBoundary>
        </div>
    )
}

export default App;
