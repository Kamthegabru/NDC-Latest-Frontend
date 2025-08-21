import React from "react";

import DisplayResult from "./DisplayResult";
import AddResult from "./AddResult";

function Result() {
    return (
        <>
            <div style={{ marginTop: '40px' }}>
                <DisplayResult />
                <AddResult />
            </div>
        </>
    );
}
export default Result;