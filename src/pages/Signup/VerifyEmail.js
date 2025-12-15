import { React, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import './VerifyEmail.scss';
import Logo from '../../assets/sitelogo-whitebackground.png';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import OTPInput from 'react-otp-input';

const baseUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api`;

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const stateMessage = location.state?.message;
    const {id} = queryString.parse(location.search);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isMessageReady, setIsMessageReady] = useState(false);
    const [invalidUser, setInvalidUser] = useState("");
    const [success, setSuccess] = useState(false);
    const [OTP, setOTP] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState({});
    
    const verifyToken = async () => {
        try{
            const { data } = await axios.get(
                `${baseUrl}/user/verify-email?id=${id}`
            );
            console.log("data:", data);
        } catch (error) {
            setIsError(true);
            console.log(isError);
            if(error?.response.data) {
                const { data } = error.response;
                if(!data.success) {
                    setMessage(data.error);
                    return(
                        setInvalidUser(data.error)
                    )
                }
                return(
                    console.log(error.response.data)
                )
            }
            console.log(error);
        }
    }

    const verifyEmailCode = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post(
                `${baseUrl}/verify-email?id=${id}`,
                {otp:OTP, userId: id}
            );
            if(data.success) {
                setSuccess(true);
                navigate('/login', { state: { message: data.message } });
            }
        } catch (error) {
            if (error?.response?.data) {
                const {data} = error.response;
                setIsMessageReady(true);
                setResponse({message: error.response.data.error});
                if(!data.success) {
                    return(
                        setError(error.response.data.error)
                    )
                }
                console.log(error);
            }
        }
        
    }

    const resendCode = async () => {
        try {
            const { data } = await axios.post(`${baseUrl}/resend-verification-code`, { userId: id });
            setMessage(data.message);
            setIsMessageReady(true);
        } catch (error) {
            if (error?.response?.data) {
                setIsMessageReady(true);
                setResponse({message: error.response.data.error});
            } else {
                console.error(error);
                setError("An error occurred while resending the code.");
                setIsMessageReady(true);
            }
        }
    }

    useEffect(() => {
        verifyToken();
    }, [])

    return (
        <>
            <a href='/login' className="go-back-btn">
                <FontAwesomeIcon icon={faArrowLeft} />
            </a>
            <section className='wrapper' data-aos="fade-up" data-aos-duration="1500">
                <div className='container'>
                    <div className='form-data'>
                        {isError ? 
                            <>
                                <p>
                                    This link is for <strong>one-time use</strong>.<br/><br/>
                                    <strong>{message}</strong>.<br/><br/>
                                    If you would like to verify email, please try again.<br /><br />
                                    <a href='/signup'>Sign up</a>
                                </p>
                            </> : 
                            <>
                                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                                    {stateMessage && <div>{stateMessage}</div>}
                                </Alert>
                                {/* task:  re-send OTP code in case of some kind of error or wrong email */}
                                <form action="">
                                    <img className='image' src={Logo} alt="logo"/>
                                    <p style={{ marginBottom: '10px' }}>
                                        Enter your verification code here
                                    </p>
                                    <OTPInput
                                        onChange={setOTP}
                                        value={OTP}
                                        numInputs={6}
                                        renderSeparator={<span></span>}
                                        inputStyle="otpInputBox"
                                        renderInput={(props) => <input {...props} />}
                                    />
                                    <button 
                                        className='appointment-btn'
                                        type='submit'
                                        onClick={verifyEmailCode}>
                                        Submit
                                    </button>
                                </form>
                                <button 
                                    className='appointment-btn'
                                    type='submit'
                                    onClick={resendCode}
                                >
                                    Resend OTP Code
                                </button>
                            </>
                        }
                        {isMessageReady ? 
                            <Alert severity="warning" color="warning" style={{ maxWidth: '500px', textAlign:'center' }}>
                                {response.message}
                            </Alert> : null
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default VerifyEmail;