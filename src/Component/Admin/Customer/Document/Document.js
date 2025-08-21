import React from 'react';

import DisplayDocument from './DisplayDocument';
import AddDocument from './AddDocument';



function Document() {
    return (
        <>
            <div style={{ marginTop: '40px' }}>
                <DisplayDocument />
                <AddDocument />
            </div>
        </>
    );
}

export default Document;