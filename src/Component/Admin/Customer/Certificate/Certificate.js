import React from 'react';

import DisplayCertificate from './DisplayCertificate';
import AddCertificate from './AddCertificate';

function Certificate() {
    return (
        <>
            <div style={{ marginTop: '40px' }}>
                <DisplayCertificate />
                <div className='flex justify-end  mt-4'>
                <AddCertificate />
                </div>
            </div>
        </>
    );
}

export default Certificate;