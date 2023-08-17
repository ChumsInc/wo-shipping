import React from 'react';
import {useAppDispatch} from "../../app/hooks";
import {useSelector} from "react-redux";
import {dismissAlert, selectAlerts} from "./index";
import {Alert} from "chums-components";

const AlertList = () => {
    const dispatch = useAppDispatch();
    const alerts = useSelector(selectAlerts);

    const dismissHandler = (key:string|number) => dispatch(dismissAlert(key));

    return (
        <div>
            {Object.keys(alerts).map(key => (
                <Alert key={key} color={alerts[key].color} onDismiss={() => dismissHandler(key)} count={alerts[key].count}>
                    [<strong>{alerts[key].context}</strong>] {alerts[key].message}
                    {!!alerts[key].error && (
                        <div style={{whiteSpace: 'pre-wrap'}}>{alerts[key].error?.stack}</div>
                    )}
                </Alert>
            ))}
        </div>
    )
}

export default AlertList;
