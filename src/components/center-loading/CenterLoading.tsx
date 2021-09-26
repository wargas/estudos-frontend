import React from 'react';
import { Spinner } from 'react-bootstrap';

export function CenterLoading({show = false}) {
    if(!show) {
        return null;
    }
    return (
        <div className="d-flex p-5 alig-items-center justify-content-center">
            <Spinner animation="border" />
        </div>
    )
}