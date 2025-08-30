import React from "react";

import DisplayResult from "./DisplayResult";
import AddResult from "./AddResult";

function Result() {
    return (
        <>
            <div style={{ marginTop: '40px' }}>
                <div className=" overflow-hidden">

                <DisplayResult />
                </div>
                <div className="flex justify-end  mt-4">

                <AddResult />
                </div>
            </div>
        </>
    );
}
export default Result;