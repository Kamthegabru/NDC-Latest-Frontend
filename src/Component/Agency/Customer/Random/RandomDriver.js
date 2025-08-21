import React from "react";

import AllQuater from "./AllQuarter";
import CurrentQuater from "./CurrentQuarter";


function RandomDriver() {
    return (
        <>
            <div style={{marginTop:''}}>
                <CurrentQuater />
                <AllQuater />
            </div>
        </>
    );
}

export default RandomDriver;