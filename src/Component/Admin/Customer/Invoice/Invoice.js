import React from 'react';

import DisplayInvoice from './DisplayInvoice';
import AddInvoice from './AddInvoice';

function Invoice() {
    return (
        <>
            <div style={{ marginTop: '40px' }}>
                <DisplayInvoice />
                <AddInvoice />
            </div>
        </>
    );
}
export default Invoice;