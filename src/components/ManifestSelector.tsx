import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ShipDateSelect from "../ducks/shipDates/ShipDateSelect";
import {SpinnerButton} from "chums-ducks";
import {loadingEntriesSelector} from "../ducks/manifest";
import {fetchManifestEntriesAction} from "../ducks/manifest/actions";
import {selectedShipDateSelector} from "../ducks/shipDates";

const ManifestSelector: React.FC = () => {
    const dispatch = useDispatch();
    const shipDate = useSelector(selectedShipDateSelector);
    const loading = useSelector(loadingEntriesSelector);

    useEffect(() => {
        dispatch(fetchManifestEntriesAction());
    }, [shipDate])

    const clickHandler = () => dispatch(fetchManifestEntriesAction());
    return (
        <div className="row g-3">
            <div className="col-auto">
                <ShipDateSelect/>
            </div>
            <div className="col-auto">
                <SpinnerButton spinning={loading} size="sm" onClick={clickHandler}>Reload</SpinnerButton>
            </div>
        </div>
    )
}

export default ManifestSelector;
