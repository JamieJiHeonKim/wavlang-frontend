import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoggedOutTranscribePage.scss';

const LoggedOutTranscribePage = () => {
    let navigate = useNavigate();
    const handleLoginRedirect = () => {
        navigate('/login');
    }

    return (
        <section className='pricing-section'>
            <div className='pricing-title'>
                <div className="container">
                    <h2>Access Restricted</h2>
                    <p>You must be signed in to use the transcription service</p>
                </div>
                <div className="pricingtable-row" data-aos="fade-up" data-aos-duration="1500">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s">
                            <h4 className='h4-title'>Please Sign in</h4>
                            <button onClick={handleLoginRedirect} className='login-btn'>Go to Login Page</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoggedOutTranscribePage;