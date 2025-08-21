import React from 'react';

function Privacy() {
    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "100px 20px 40px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                lineHeight: "1.8",
                color: "#333",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    fontSize: "2.8rem",
                    color: "#2c3e50",
                    marginBottom: "40px",
                    borderBottom: "2px solid #eee",
                    paddingBottom: "10px",
                }}
            >
                Privacy Policy
            </h1>

            <p style={{ fontWeight: "bold", color: "#000" }}>
    Last Updated: 01/04/2025
</p>


            <p>
                At Nationwide Drug Centers, accessible via <a href="https://nwdrugtesting.com/" style={{ color: '#1a5276', textDecoration: 'none' }}>https://nwdrugtesting.com/</a>, your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website and other sites we own and operate.
            </p>

            <p>
                We only ask for personal information when it is truly needed to provide a service to you. Information is collected by fair and lawful means, with your knowledge and consent. We also ensure you are informed about why we’re collecting your data and how it will be used. We retain the collected information only as long as necessary to provide you with the requested service. Any data stored is protected within commercially acceptable standards to prevent loss, theft, unauthorized access, disclosure, copying, use, or modification.
            </p>

            <p>
                We do not share any personally identifying information publicly or with third parties, except as required by law. Authorized parties such as employers, medical review officers, or laboratories may receive your information only for DOT compliance purposes. Our website may link to external sites not operated by us. Please note that we have no control over the content or privacy practices of these external sites and cannot accept responsibility for their respective privacy policies.
            </p>

            <p>
                Our website uses cookies and similar technologies to enhance user experience and analyze website performance. You are free to manage cookie preferences through your browser settings. Refusing to provide personal information may limit the services we can offer you. Your continued use of our website signifies acceptance of our practices regarding privacy and personal data. If you have any questions about how we handle your data, please contact us at <a href="mailto:info@ndctesting.com" style={{ color: '#1a5276', textDecoration: 'none' }}>info@ndctesting.com</a>.
            </p>

            <p>
                We reserve the right to update this policy at any time, and any changes will be posted on this page with an updated effective date. Protecting your privacy and maintaining your trust is our priority.
            </p>

            <p>
                No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All other categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.
            </p>
        </div>
    );
}

export default Privacy;
