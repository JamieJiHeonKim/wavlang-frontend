import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.scss';
import Logo from '../../assets/sitelogo-whitebackground.png';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Alert } from '@mui/material';
import googleIcon from '../../assets/google.png';

const ForgotPassword = () => {
    const location = useLocation();
    const message = location.state?.message;
    const [email, setEmail] = useState("");
    const [response, setResponse] = useState("");
    const [isResponseReady, setIsResponseReady] = useState(false);
    const [resultStatus, setResultStatus] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        verifyEmail(email);
    };

    const verifyEmail = async (emailInput) => {
        try{
            setIsResponseReady(false);
            const res = await axios
                .post("http://localhost:8080/api/forgot-password", {
                    email: emailInput
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            navigate('/login', { state: { message: res.data.message } });
        } catch (err) {
            if(err.response) {
                setResponse({message: err.response.data.error});
                setIsResponseReady(true);
            }
        }
    };

    useEffect(() => {
    }, [email, response, isResponseReady, resultStatus]);

    return (
        <>
            <a href='/login' className="go-back-btn">
                <FontAwesomeIcon icon={faArrowLeft} />
            </a>
            <section className='wrapper' data-aos="fade-up" data-aos-duration="1500">
                <div className='container'>
                    {message && <div className="alert alert-success">{message}</div>}
                    <div className='form-data'>
                        <form action="">
                            <img className='image' src={Logo} alt="logo"/>
                            <p>
                                Enter your email address to reset password
                            </p>
                            <input
                                type="text"
                                placeholder='Email address'
                                required
                                style={{ marginBottom: '10px', marginTop: '10px' }}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <button className='appointment-btn' type="submit" onClick={(e) => handleSubmit(e)} >
                                Reset Password
                            </button>
                            {/* <a href='/forgot-password' className='forgotpassword-url'>Log</a>
                            <p className='signup' >Don't have an account? <a href='/signup' className='signup-url' >Sign up</a></p> */}
                        </form>
                        {isResponseReady ? 
                            <Alert severity="warning" color="warning" style={{ maxWidth: '450px', textAlign:'center' }}>
                                {response.message}
                            </Alert> : null
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default ForgotPassword;