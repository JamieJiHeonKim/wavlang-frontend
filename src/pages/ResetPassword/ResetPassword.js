import { React, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.scss';
import Logo from '../../assets/sitelogo-whitebackground.png';
import axios from 'axios';
import queryString from 'query-string';
import { Checkbox } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';

const baseUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/user`;

const FormRulesDialog = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Form Submission Rules</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To submit this form, you must fill in all required fields:
                </DialogContentText>
                <ul>
                    <li>Password must be <strong>8 to 20 characters long</strong>.</li>
                    <li>Confirm Password <strong>must match</strong> the Password.</li>
                </ul>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

FormRulesDialog.defaultProps = {
    open: false,
    onClose: () => {},
};

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [touched, setTouched] = useState({});
    const [invalidUser, setInvalidUser] = useState("");
    const [busy, setBusy] = useState(true);
    const [input, setInput] = useState({
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState({});
    const {token, id} = queryString.parse(location.search);
    const [success, setSuccess] = useState(false);
    const [isMessageReady, setIsMessageReady] = useState(false);
    const [response, setResponse] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const onInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setInput((prev) => ({
            ...prev,
            [name]: newValue,
        }));
        if (touched[name]) {
            validateInput(e);
        }
    };

    const handleBlur = e => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateInput(e);
    };
    const validatePassword = (password) => {
        return password.length >= 8 && password.length <= 20;
    };

    const validateInput = (name, value) => {
        let error = '';
        if (name === "password") {
            if (!validatePassword(value)) {
                error = "Password must be 8 to 20 characters long";
            }
        } else if (name === "confirmPassword") {
            if (input.password && value !== input.password) {
                error = "Your passwords do not match";
            }
        }
        setError(prev => ({ ...prev, [name]: error }));
        return error;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        Object.keys(input).forEach(key => {
            const error = validateInput(key, input[key]);
            if (error) formIsValid = false;
        });
    
        if (formIsValid) {
            resetPassword(input.password);
        } else {
            setIsModalOpen(true);
        }
    }

    const verifyToken = async () => {
        try{
            const { data } = await axios.get(
                `${baseUrl}/verify-token?token=${token}&id=${id}`
            );
            setBusy(false);
        } catch (error) {
            setIsError(true);
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

    const resetPassword = async (password) => {
        try {
            setBusy(true);
            const {data} = await axios.post(
                `${baseUrl}/reset-password?token=${token}&id=${id}`,
                {password}
            );
            setBusy(false);
            if(data.success) {
                setSuccess(true);
                navigate('/login', { state: { message: data.message } });
            }
        } catch (error) {
            setBusy(false);
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

    useEffect(() => {
        verifyToken();
    }, [isError,response,isMessageReady])

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
                                <strong>{message}</strong>.<br/><br/>
                                This link for <strong>one-time use</strong>.<br/><br/>If you would like to reset your password, please try again.<br /><br />
                                <a href='/forgot-password'>Forgot password</a>
                            </p>
                        </> :
                        <form action="">
                            <img className='image' src={Logo} alt="logo"/>
                            <input
                                type="password"
                                name="password"
                                placeholder='Create new password'
                                value={input.password}
                                required
                                style={{ marginBottom: '10px' }}
                                onChange={onInputChange}
                                onBlur={handleBlur}></input>
                                {error.password && <span className='error-message'>{error.password}</span>}
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder='Confirm password'
                                value={input.confirmPassword}
                                required
                                style={{ marginBottom: '10px' }}
                                onChange={onInputChange}
                                onBlur={handleBlur}></input>
                                {error.confirmPassword && <span className='err'>{error.confirmPassword}</span>}
                            <FormRulesDialog
                                open={isModalOpen}
                                onClose={() => {
                                    setIsModalOpen(false);
                                }}
                            />
                            <button 
                                className='appointment-btn' 
                                type='submit' 
                                onClick={handleSubmit}>
                                Reset Password
                            </button>
                        </form>
                        }
                        {isMessageReady ? 
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

export default ResetPassword;