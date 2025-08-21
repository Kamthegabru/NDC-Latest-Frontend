import React from 'react';

function Error404Page() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center",minHeight: `calc(100vh - 120px)` }} >
            <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "5rem", color: "#f44336" }}>404</h1>
                <h2 style={{ fontSize: "2rem" }}>Page Not Found</h2>
                <p style={{ fontSize: "1.5rem" }}>Sorry, the page you are looking for does not exist.</p>
            </div>
        </div>
    );
}

export default Error404Page;