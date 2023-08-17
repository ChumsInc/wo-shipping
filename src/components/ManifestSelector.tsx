import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import ShipDateSelect from "../ducks/shipDates/ShipDateSelect";
import {SpinnerButton} from "chums-components";
import {loadManifestEntries} from "../ducks/manifest/actions";
import {selectCurrentShipDate} from "../ducks/shipDates";
import {useAppDispatch} from "../app/configureStore";
import {selectManifestLoading} from "../ducks/manifest/selectors";

const ManifestSelector: React.FC = () => {
    const dispatch = useAppDispatch();
    const shipDate = useSelector(selectCurrentShipDate);
    const loading = useSelector(selectManifestLoading);

    useEffect(() => {
        dispatch(loadManifestEntries(shipDate));
    }, [shipDate])

    const clickHandler = () => dispatch(loadManifestEntries(shipDate));

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
