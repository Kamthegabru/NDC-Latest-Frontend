import React from "react";

import AddDriver from "./AddDriver";
import ActiveDriver from "./ActiveDriver";
import DeletedDriver from "./DeletedDriver";

function Driver() {
    return (
        <>
            <div className="container" style={{ marginTop: '100px' }}>
                <h2 style={{color:"#003366"}}>Employees Information</h2>
                <AddDriver/>
                <p style={{fontSize:'28px', fontWeight:500,marginBottom:'0px'}}>Active Employee</p>
                <ActiveDriver/>
                <p style={{fontSize:'28px', fontWeight:500,marginBottom:'0px', marginTop:'30px'}}>Deleted Employee</p>
                <DeletedDriver/>
            </div>
        </>
    )
}

export default Driver;