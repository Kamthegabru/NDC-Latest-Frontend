import React, { useContext } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

import SignupContext from '../../../Context/ClientSide/SignUp/SignupContext';

export default function Pricing() {
    const { setSelectedPlan } = useContext(SignupContext);
    const navigate = useNavigate();

    const handlePlan = (planId) => {
        setSelectedPlan(planId);
        navigate("/signup");
    };

    return (
        <>
            {/* Pricing Section */}
            <div style={{ marginTop: '120px', maxWidth: '1140px', marginLeft: 'auto', marginRight: 'auto', minHeight: `calc(100vh - 240px)` }}>
                {/* Heading Box */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div style={{
                        backgroundColor: "#f8f9fa",
                        padding: "25px 20px",
                        borderRadius: "16px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        marginBottom: "30px",
                        border: "2px solid #e0e0e0"
                    }}>
                        <p className='text-center' style={{ color: "#007bff", fontWeight: 700, letterSpacing: '1px', marginBottom: "5px" }}>PRICING</p>
                        <p className='text-center' style={{ fontSize: '28px', fontWeight: '800', marginBottom: '5px', color: '#212529' }}>DRUG TESTING PLANS</p>
                        <p className='text-center' style={{ fontSize: '15px', color: '#6c757d', marginBottom: 0 }}>
                            Pay by the month or the year, and cancel at any time.
                        </p>
                    </div>
                </motion.div>

                {/* Pricing Cards */}
                <div className='row gx-4 gy-4 d-flex align-items-stretch justify-content-center'>
                    {[
                        {
                            title: 'NON-DOT Account',
                            price: '$99',
                            subtitle: 'Occupation Health Service Plan',
                            bg: 'rgba(164, 152, 152, 1)',
                            features: [
                                'Drug Account Only',
                                '$75 Per Drug Test',
                                '$65 Per Alcohol Test',
                                'Online 24/7 Access',
                                'Access to 20,000 labs Nationwide',
                            ]
                        },
                        {
                            title: '1 Year Random Enrollment',
                            price: '$150',
                            subtitle: 'DOT Random Drug & Alcohol Testing Program',
                            bg: '#00FFFF',
                            features: [
                                'DOT Random Enrollment',
                                'Random Enrollment Certificate',
                                'Access to 50,000 + Labs Nationwide',
                                'DOT Drug Test $79',
                                'Alcohol Test $65',
                                'Dedicated Account Manager',
                                'DOT Safety Audit Support',
                                '24/7 Online Access'
                            ]
                        },
                        {
                            title: '3 Year Random Enrollment',
                            price: '$275',
                            subtitle: 'Perfect for Trucking Companies',
                            bg: '#00FF00',
                            features: [
                                'DOT Random Enrollment',
                                'Instant Random Enrollment Certificate',
                                'Access to 50,000+ Labs Nationwide',
                                'Drug Test $75',
                                'Alcohol Test $65',
                                'Dedicated Account Manager',
                                'Audit Support',
                                'Unlimited Drivers/Employees',
                                'One-Time Setup - No renewal cost'
                            ]
                        }
                    ].map((plan, index) => (
                        <motion.div
                            key={index}
                            className='col-lg-4 col-md-6 d-flex'
                            style={{ marginTop: '15px', maxWidth: '380px' }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.2 }}
                        >
                            <div className="card flex-fill" style={{ backgroundColor: plan.bg, borderRadius: '14px', height: '100%' }}>
                                <div className="card-body d-flex flex-column p-3" style={{ minHeight: '520px' }}>
                                    <div className='text-center mb-2'>
                                        <p style={{ fontSize: '22px', marginBottom: '4px' }}>{plan.title}</p>
                                        <p style={{ fontSize: '22px', marginBottom: '2px' }}>{plan.price}</p>
                                        <p style={{ fontSize: '15px', marginBottom: '4px' }}>Every Year</p>
                                        <p style={{ fontSize: '15px', color: '#444' }}>{plan.subtitle}</p>
                                        <hr style={{ color: "white", height: '2px' }} />
                                    </div>
                                    <div className="flex-grow-1">
                                        {plan.features.map((item, i) => (
                                            <p key={i} style={{ margin: '6px 0' }}>
                                                <CheckIcon style={{ marginRight: '6px', fontSize: '16px' }} />
                                                {item}
                                            </p>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn custom-btn mt-auto"
                                        onClick={() => handlePlan(index + 1)}
                                    >
                                        Select Plan
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>
                {`
                    .custom-btn {
                        width: 100%;
                        background-color: white;
                        color: #007bff;
                        border: 2px solid #007bff;
                        transition: background-color 0.3s, color 0.3s;
                        font-weight: 600;
                        border-radius: 8px;
                        padding: 10px;
                        font-size: 15px;
                    }

                    .custom-btn:hover {
                        background-color: #007bff;
                        color: white;
                    }

                    .card {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                    }

                    .card-body {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                    }

                    .flex-grow-1 {
                        flex-grow: 1;
                    }

                    .card-body * {
                        font-weight: bold !important;
                        font-size: 15px;
                    }
                `}
            </style>
        </>
    );
}
