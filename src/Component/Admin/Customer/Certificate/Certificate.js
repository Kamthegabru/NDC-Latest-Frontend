import React from 'react';

import DisplayCertificate from './DisplayCertificate';
import AddCertificate from './AddCertificate';

function Certificate() {
    return (
        <>
            <div style={{ marginTop: '40px' }}>
                <DisplayCertificate />
                <AddCertificate />
            </div>
        </>
    );
}

export default Certificate;