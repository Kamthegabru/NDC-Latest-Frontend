import React from 'react';

import DisplayInvoice from './DisplayInvoice';
import AddInvoice from './AddInvoice';

function Invoice() {
    return (
        <>
            <div style={{ marginTop: '40px' }}>
                <DisplayInvoice />
                <div className='flex justify-end  mt-4'>
                <AddInvoice />
                </div>
            </div>
        </>
    );
}
export default Invoice;