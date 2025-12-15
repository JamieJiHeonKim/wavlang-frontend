import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.scss';
import Logo from '../../assets/sitelogo-whitebackground.png';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { signinGoogle, signin } from '../../redux/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Alert } from '@mui/material';
import googleIcon from '../../assets/google.png';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
import { useAuth } from '../../components/AuthContext/AuthContext';

const LoginForm = () => {
    const location = useLocation();
    const message = location.state?.message;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState("");
    const [isMessageReady, setIsMessageReady] = useState(false);
    const [notVerified, setNotVerified] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const { loginAuth } = useAuth();

    const handleGoogleLoginSuccess = (tokenResponse) => {
        const accessToken = tokenResponse.access_token;
        dispatch(signinGoogle(accessToken, navigate));
    };

    const login = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        verifyEmail(email, password);
    };

    const googleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log('Google login successful', tokenResponse);
        },
        onError: () => {
            console.error('Google login failed');
        },
        flow: 'auth-code',
    });

    const verifyEmail = async (emailInput, passwordInput) => {
        try{
            setNotVerified(false);
            const res = await axios
                .post(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/signin`, {
                    email: emailInput,
                    password: passwordInput
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            if(res.data.user.verified) {
                setNotVerified(false);
                setCookie('access-token', res.data.user.token, {
                    path: "/", maxAge: 14400
                });
                setCookie('email', emailInput);
                setCookie('firstName', res.data.user.firstName);
                setCookie('lastName', res.data.user.lastName);
                loginAuth(res);
                navigate('/');
            } else {
                setNotVerified(true);
                setResponse({message: "Verification email has been sent to your inbox. Please verify."})
            }
        } catch (err) {
            if(err.response) {
                setNotVerified(true);
                setResponse({message: err.response.data.error});
                setIsMessageReady(true);
            }
        }
    };

    useEffect(() => {
    }, [response, isMessageReady, email, password, notVerified]);

    return (
        <>
            <a href='/' className="go-back-btn">
                <FontAwesomeIcon icon={faArrowLeft} />
            </a>
            <section className='wrapper' data-aos="fade-up" data-aos-duration="1500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <div className='container'>
                    {message && <div className="alert alert-success">{message}</div>}
                    <div className='form-data'>
                        <form action="">
                            <img className='image' src={Logo} alt="logo"/>
                            <input
                                type="text"
                                placeholder='Email address'
                                required
                                style={{ marginBottom: '10px' }}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <input 
                                type="password"
                                placeholder='Password'
                                required
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button className='appointment-btn' type="submit" onClick={(e) => handleSubmit(e)} >
                                Sign in
                            </button>
                            <a href='/forgot-password' className='forgotpassword-url'>Forgot password?</a>
                            <p className='signup' >Don't have an account? <a href='/signup' className='signup-url' >Sign up</a></p>
                        </form>
                        {notVerified ? 
                            <Alert severity="warning" color="warning" style={{ maxWidth: '550px', textAlign:'center' }}>
                                {response.message}
                            </Alert> : null
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default LoginForm;