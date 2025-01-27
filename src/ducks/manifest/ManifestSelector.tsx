import React, {ChangeEvent, useEffect} from 'react';
import {useSelector} from 'react-redux';
import ShipDateSelect from "../shipDates/ShipDateSelect";
import {SpinnerButton} from "chums-components";
import {loadManifestEntries} from "./actions";
import {selectCurrentShipDate, selectShipDates, setCurrentShipDate} from "../shipDates";
import {useAppDispatch} from "../../app/configureStore";
import {selectManifestLoading} from "./selectors";
import dayjs from "dayjs";
import {Col, Row} from "react-bootstrap";
export interface ManifestSelectorProps {
    future?: boolean;
}
const ManifestSelector = ({future}:ManifestSelectorProps) => {
    const dispatch = useAppDispatch();
    const shipDate = useSelector(selectCurrentShipDate);
    const loading = useSelector(selectManifestLoading);
    const shipDates = useSelector(selectShipDates);

    const now = new Date();

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
        <Row gap={3}>
            <Col xs="auto">Default Manifest Date</Col>
            <Col xs="auto">
                <ShipDateSelect value={shipDate ?? ''} onChange={changeHandler}
                                values={shipDates.filter(value => !future || dayjs(value).endOf('day').isAfter(now))}/>
            </Col>
            <Col xs="auto">
                <SpinnerButton spinning={loading} size="sm" onClick={clickHandler}>Reload</SpinnerButton>
            </Col>
        </Row>
    )
}

export default ManifestSelector;
