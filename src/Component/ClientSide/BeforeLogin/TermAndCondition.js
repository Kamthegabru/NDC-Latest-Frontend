import React from 'react';

function TermsAndConditions() {
    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "100px 20px 40px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                lineHeight: "1.8",
                color: "#333"
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    fontSize: "2.8rem",
                    color: "#2c3e50",
                    marginBottom: "40px",
                    borderBottom: "2px solid #eee",
                    paddingBottom: "10px"
                }}
            >
                Terms and Conditions
            </h1>

            {[
                {
                    title: "1. Terms",
                    content: `By accessing the website at http://www.nwdrugtesting.com, you agree to be bound by these terms of service,
                    all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                    If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    The materials contained in this website are protected by applicable copyright and trademark law.`
                },
                {
                    title: "2. Use License",
                    content: `Permission is granted to temporarily download one copy of the materials (information or software) on sample's website
                    for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under
                    this license you may not:`,
                    list: [
                        "modify or copy the materials;",
                        "use the materials for any commercial purpose, or for any public display (commercial or non-commercial);",
                        "attempt to decompile or reverse engineer any software contained on sample's website;",
                        "remove any copyright or other proprietary notations from the materials;",
                        "transfer the materials to another person or 'mirror' the materials on any other server."
                    ]
                },
                {
                    title: "3. Disclaimer",
                    content: `The materials on sample's website are provided on an 'as is' basis. Sample makes no warranties, expressed or implied,
                    and disclaims all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular
                    purpose, or non-infringement of intellectual property.`
                },
                {
                    title: "4. Limitations",
                    content: `In no event shall sample or its suppliers be liable for any damages (including, without limitation, loss of data or profit,
                    or due to business interruption) arising out of the use or inability to use the materials on sample's website.`
                },
                {
                    title: "5. Accuracy of materials",
                    content: `The materials appearing on sample's website could include technical, typographical, or photographic errors. Sample does not
                    warrant that any of the materials on its website are accurate, complete, or current.`
                },
                {
                    title: "6. Links",
                    content: `Sample has not reviewed all of the sites linked to its website and is not responsible for the contents of any such site.
                    The inclusion of any link does not imply endorsement by sample of the site.`
                },
                {
                    title: "7. Modifications",
                    content: `Sample may revise these terms of service at any time without notice. By using this website, you agree to be bound by
                    the then current version.`
                },
                {
                    title: "8. Governing Law",
                    content: `These terms are governed by the laws of CA, and you irrevocably submit to the exclusive jurisdiction of the courts in that state.`
                }
            ].map((section, index) => (
                <div key={index} style={{ marginBottom: "30px" }}>
                    <h2 style={{ color: "#1a5276", fontSize: "1.5rem", marginBottom: "10px" }}>
                        {section.title}
                    </h2>
                    <p style={{ marginBottom: section.list ? "10px" : "0" }}>{section.content}</p>
                    {section.list && (
                        <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
                            {section.list.map((item, idx) => (
                                <li key={idx} style={{ marginBottom: "6px" }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}

export default TermsAndConditions;
