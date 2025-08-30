import React from "react";

import AddDriver from "./AddDriver";
import ActiveDriver from "./ActiveDriver";
import DeletedDriver from "./DeletedDriver";

function Driver() {
    return (
        <>
            <div className="container " >
                <div className="flex flex-row justify-between align-middle mb-4">
            
                <h2 style={{color:"#003366"}}>Employees Information</h2>
                <AddDriver/>
                </div>


                <p style={{fontSize:'28px', fontWeight:500,marginBottom:'7px'}}>Active Employee</p>
                <ActiveDriver/>
                <p style={{fontSize:'28px', fontWeight:500,marginBottom:'7px', marginTop:'30px'}}>Deleted Employee</p>
                <DeletedDriver/>
            </div>
        </>
    )
}

export default Driver;