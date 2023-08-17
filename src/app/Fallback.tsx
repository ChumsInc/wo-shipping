import React from 'react';
import {FallbackProps} from "react-error-boundary";

export default function Fallback({error, resetErrorBoundary}:FallbackProps) {
    return (
        <div role="alert" className="alert alert-danger">
            <p>Something went wrong:</p>
            <pre className="text-danger">{error.message}</pre>
        </div>
    );
}
