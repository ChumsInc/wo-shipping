import React, {ChangeEvent, useEffect} from 'react';
import {useSelector} from 'react-redux';
import ShipDateSelect from "../shipDates/ShipDateSelect";
import {SpinnerButton} from "chums-components";
import {loadManifestEntries} from "./actions";
import {selectCurrentShipDate, selectShipDates, setCurrentShipDate} from "../shipDates";
import {useAppDispatch} from "../../app/configureStore";
import {selectManifestLoading} from "./selectors";

const ManifestSelector: React.FC = () => {
    const dispatch = useAppDispatch();
    const shipDate = useSelector(selectCurrentShipDate);
    const loading = useSelector(selectManifestLoading);
    const shipDates = useSelector(selectShipDates);

    useEffect(() => {
        if (shipDate) {
            dispatch(loadManifestEntries(shipDate));
        }
    }, [shipDate])

    const clickHandler = () => {
        if (shipDate) {
            dispatch(loadManifestEntries(shipDate));
        }
    }

    const changeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCurrentShipDate(ev.target.value))
    }

    return (
        <>
            <div className="col-auto">Default Manifest Date</div>
            <div className="col-auto">
                <ShipDateSelect value={shipDate ?? ''} onChange={changeHandler}
                                values={shipDates}/>
            </div>
            <div className="col-auto">
                <SpinnerButton spinning={loading} size="sm" onClick={clickHandler}>Reload</SpinnerButton>
            </div>
        </>
    )
}

export default ManifestSelector;
