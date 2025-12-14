import { React, useState, useEffect } from 'react';
import './Pricing.scss';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Payment from './Payment';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Task 1: Keep custom amount for Pay-As-You-Go only
// Task 2: Implement regular subscription for monthly and annual

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-content' onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

const Pricing = () => {
    const [open, setOpen] = useState("p2");
    const [clientSecret, setClientSecret] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const [selectedCustomAmount, setSelectedCustomAmount] = useState(100);

    let navigate = useNavigate();
    const handleLoginRedirect = () => {
        navigate('/login');
    }

    const plans = [
        {
            id: "p1",
            name: "Pay As You Go",
            price: 1.00,
            benefits: [
                "Cheapest for Short Audio Files",
                "Great Flexibility",
                "Cost-Effective",
                "No Commitment",
                "Perfect for One-time Users",
            ],
            recurrence: "No Recurrence"
        },
        {
            id: "p2",
            name: "Monthly Plan",
            price: 6.99,
            benefits: [
                "No Additional Cost",
                "Best Value",
                "Unlimited Access",
                "Little Commitment",
                "Perfect for Regular Use",
            ],
            recurrence: "Every Month"
        },
        {
            id: "p3",
            name: "Annual Plan",
            price: 59.99,
            benefits: [
                "No Additional Cost",
                "Good Value",
                "Unlimited Access All Year",
                "Long-term Commitment",
                "Perfect for Long-term Use",
            ],
            recurrence: "Every Year"
        },
    ];

    const isAuthenticated = async () => {
        const userToken = Cookies.get('access-token');
        const userEmail = Cookies.get('email');
        if (!userToken || !userEmail) {
            setIsVerified(false);
            return false;
        }
        try {
            const decoded = jwtDecode(userToken);
            const res = await axios.get(`http://localhost:8080/api/user/authenticated`, {
                headers: { 
                    'x-access-token': decoded.userId,
                    'email': userEmail
                }
            });
            if (res.data.data.email === Cookies.get('email')) {
                setIsVerified(true);
                return true;
            } else {
                setIsVerified(false);
                return false;
            }
        } catch (err) {
            console.error(err);
            setIsVerified(false);
            return false;
        }
    };

    const handlePayment = async (plan) => {
        const isAuth = await isAuthenticated();

        if (!isAuth) {
            setIsVerified(false);
            setModalOpen(true);
            return;
        };

        if (plan.name === "Pay As You Go") {
            setSelectedCustomAmount(100);
        } else {
            setSelectedCustomAmount(null);
        };

        const amount = Math.round(plan.price * 100);

        try {
            const response = await fetch('http://localhost:8080/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount })
            });
            if (response.ok) {
                const paymentIntent = await response.json();
                setClientSecret(paymentIntent.clientSecret);
                setSelectedPlan(plan)
                setModalOpen(true);
            }
            else {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const handleCloseModal = () => setModalOpen(false);

    return (
        <section className='pricing-section'>
            <div className='pricing-title'>
                <div className="container">
                    <h2>Choosing The Plan</h2>
                    <p>WavLang offers different plans for different usages. Select the plan that is best suitable for you.</p>
                </div>
                <br />
                <br />
                <div className="pricingtable-row" data-aos="fade-up" data-aos-duration="1500">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s">
                            <div className={`${open === "p1" ? "pricingtable-wrapper style-1 m-b30 active" : "pricingtable-wrapper style-1 m-b30"}`} onMouseOver={() => setOpen("p1")}>
                                <div className="pricingtable-inner">
                                    <div className="pricingtable-title">
                                        <h3>Pay As You Go</h3>
                                    </div>
                                    <div className="icon-bx-sm radius bgl-primary">
                                        <div className="icon-cell">
                                            <i className="flaticon-paper-plane"></i>
                                        </div>
                                    </div>
                                    <div className="pricingtable-price">
                                        <h2 className="pricingtable-bx">¢10<small className="pricingtable-type">/minute</small></h2>
                                    </div>
                                    <ul className="pricingtable-features">
                                        <li>Cheapest for Short Audio Files</li>
                                        <li>Great Flexibility</li>
                                        <li>Cost-Effective</li>
                                        <li>No Commitment</li>
                                        <li>Perfect for One-time Users</li>
                                    </ul>
                                    <div className="pricingtable-footer">
                                        <button className='appointment-btn' onClick={() => handlePayment(plans[0])}>Start Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.4s">
                            <div className={`${open === "p2" ? "pricingtable-wrapper style-1 m-b30 active" : "pricingtable-wrapper style-1 m-b30"}`} onMouseOver={() => setOpen("p2")}>
                                <div className="pricingtable-inner">
                                    <div className="pricingtable-title">
                                        <h3>Monthly Plan</h3>
                                    </div>
                                    <div className="icon-bx-sm radius bgl-primary">
                                        <div className="icon-cell">
                                            <i className="flaticon-air-mail"></i>
                                        </div>
                                    </div>
                                    <div className="pricingtable-price">
                                        <h2 className="pricingtable-bx">$6.99<small className="pricingtable-type">/month</small></h2>
                                    </div>
                                    <ul className="pricingtable-features">
                                        <li>No Additional Cost</li>
                                        <li>Reoccurence</li>
                                        <li>Best Value</li>
                                        <li>Unlimited Access</li>
                                        <li>Perfect for Regular Use</li>
                                    </ul>
                                    <div className="pricingtable-footer">
                                        <button className='appointment-btn' onClick={() => handlePayment(plans[1])}>Start Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.6s">
                            <div className={`${open === "p3" ? "pricingtable-wrapper style-1 m-b30 active" : "pricingtable-wrapper style-1 m-b30"}`} onMouseOver={() => setOpen("p3")}>
                                <div className="pricingtable-inner">
                                    <div className="pricingtable-title">
                                        <h3>Annual Plan</h3>
                                    </div>
                                    <div className="icon-bx-sm radius bgl-primary">
                                        <div className="icon-cell">
                                            <i className="flaticon-startup"></i>
                                        </div>
                                    </div>
                                    <div className="pricingtable-price">
                                        <h2 className="pricingtable-bx">$59.99<small className="pricingtable-type">/year</small></h2>
                                    </div>
                                    <ul className="pricingtable-features">
                                        <li>No Additional Cost</li>
                                        <li>Reoccurence</li>
                                        <li>Good Value</li>
                                        <li>Unlimited Access All Year</li>
                                        <li>Perfect for Long-term Use</li>
                                    </ul>
                                    <div className="pricingtable-footer">
                                        <button className='appointment-btn' onClick={() => handlePayment(plans[2])}>Start Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <br /><br /><br />
                            {/* <p>If you would like to talk about the Enterprise Plan, please contact us at admin@wavlang.com</p> */}
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {isVerified ? (
                    clientSecret && selectedPlan && (
                        <Elements stripe={stripePromise}>
                            <Payment 
                                clientSecret={clientSecret} 
                                planDetails={selectedPlan} 
                                customAmount={selectedPlan.name === "Pay As You Go" ? selectedCustomAmount : undefined}
                            />
                        </Elements>
                    )
                ) : (
                    <div className='login-prompt'>
                        <h2>Access Restricted</h2>
                        <p style={{ paddingBottom: '15px', textAlign: 'center' }}>Please log in to proceed with payment.</p>
                        <button onClick={handleLoginRedirect} className='login-btn'>Go to Login Page</button>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default Pricing;