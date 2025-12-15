import { React, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.scss';
import Logo from '../../assets/sitelogo-whitebackground.png';
import axios from 'axios';
import { Checkbox } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const MESSAGE_TYPES = {
    FORM_RULES: 'formRules',
    EMAIL_EXISTS: 'emailExists',
};

const FormRulesDialog = ({ open, onClose, messageType }) => {
    const getMessageContent = () => {
        switch (messageType) {
            case MESSAGE_TYPES.FORM_RULES:
            return (
                <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Form Submission Rules</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To submit this form, you must fill in all required fields:
                        </DialogContentText>
                        <ul>
                            <li>First Name & Last Name must be <strong>at least 2 characters</strong> long.</li>
                            <li>Email should be in a valid email format <strong>(example@example.com)</strong>.</li>
                            <li>Password must be <strong>8 to 20 characters long</strong>.</li>
                            <li>Confirm Password <strong>must match</strong> the Password.</li>
                            <li>You <strong>must accept</strong> the Terms and Conditions.</li>
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
            case MESSAGE_TYPES.EMAIL_EXISTS:
            return (
                <DialogContentText>
                    The email address you entered already exists in our database.<br/>
                    Please use a different email address or login to your existing account.
                </DialogContentText>
            );
            defult:
                return null;
        }
    }
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Form Submission Rules</DialogTitle>
                <DialogContent>
                {getMessageContent()}
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

const Signup = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [touched, setTouched] = useState({});
    const [input, setInput] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        checked: false
    });
    const [error, setError] = useState({});
    const [messageType, setMessageType] = useState(MESSAGE_TYPES.FORM_RULES);


    const handleBlur = e => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateInput(e);
    };
    
    const renderErrorMessage = () => {
        if (error && touched) {
            if (error.firstName && touched.firstName) {
                return <p className="error-message">{error.firstName}</p>;
            } else if (error.lastName && touched.lastName) {
                return <p className="error-message">{error.lastName}</p>;
            }
        }
        return null;
    };

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

    const validateName = (name) => {
        const regex = /^[a-zA-Z]+(?:['-][a-zA-Z]+)*$/;
        return regex.test(name) && name.length >= 2;
    };

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }

    const validatePassword = (password) => {
        return password.length >= 8 && password.length <= 20;
    };

    const validateInput = (name, value) => {
        switch (name) {
            case "firstName":
            case "lastName":
                if (!validateName(value)) {
                    return "Invalid character or must be at least 2 characters long";
                }
                return '';
            case "email":
                if (!validateEmail(value)) {
                    return "Invalid email format";
                }
                return '';
            case "password":
                if (!validatePassword(value)) {
                    return "Password must have at least 8 characters";
                }
                return '';
            case "confirmPassword":
                if (input.password && value !== input.password) {
                    return "Your passwords do not match";
                }
                return '';
            default:
                return '';
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        let newErrors = {};
        
        Object.keys(input).forEach(key => {
            const value = input[key];
            const error = validateInput(key, value);
            newErrors[key] = error;
            if (error) formIsValid = false;
        });
    
        if (!input.checked) {
            newErrors.checked = "You must accept the Terms and Conditions.";
            formIsValid = false;
        }
    
        if (formIsValid) {
            try {
                await createUser(input);
            } catch (err) {
                if (err.response && err.response.status === 409) {
                    setMessageType(MESSAGE_TYPES.EMAIL_EXISTS);
                } else {
                    console.error('An error occurred:', err);
                }
                setIsModalOpen(true);
            }
        } else {
            setMessageType(MESSAGE_TYPES.FORM_RULES);
            setIsModalOpen(true);
        }
    }

    const createUser = async (obj) => {
        try{
            const userFirstName = obj.firstName.charAt(0).toUpperCase() + obj.firstName.slice(1);
            const userLastName = obj.lastName.charAt(0).toUpperCase() + obj.lastName.slice(1);
            const userEmail = obj.email.toLowerCase();
            const user = {
                "firstName": userFirstName,
                "lastName": userLastName,
                "email": userEmail,
                "password": obj.password
            };
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
            const { data } = await axios.post(`${apiUrl}/api/new_user`, user, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("A new user has been added in the system.");
            navigate(`/verify-email?id=${data._id}`, { state: { message: 'A verification email to create a new user has been sent to your inbox' } });
        } catch(err) {
            console.error("An error occurred:", err);
            if (err.response && err.response.status === 409) {
                setMessageType(MESSAGE_TYPES.EMAIL_EXISTS);
                setIsModalOpen(true);
            } else {
            }
        }
    };

    return (
        <>
            <a href='/login' className="go-back-btn">
                <FontAwesomeIcon icon={faArrowLeft} />
            </a>
            <section className='wrapper' data-aos="fade-up" data-aos-duration="1500">
                <div className='container'>
                    <div className='form-data'>
                        <form action="">
                            <img className='image' src={Logo} alt="logo"/>
                            <div className='name'>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder='First Name'
                                    value={input.firstName}
                                    required
                                    style={{ marginBottom: '10px' }}
                                    onChange={onInputChange}
                                    onBlur={handleBlur}></input>
                                    
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder='Last Name'
                                    value={input.lastName}
                                    required
                                    style={{ marginBottom: '10px' }}
                                    onChange={onInputChange}
                                    onBlur={handleBlur}></input>
                            </div>
                            {renderErrorMessage()}
                            <input
                                type="text"
                                name="email"
                                placeholder='Email'
                                value={input.email}
                                required
                                style={{ marginBottom: '10px' }}
                                onChange={onInputChange}
                                onBlur={handleBlur}></input>
                                {touched.email && error.email && <p className="error-message">{error.email}</p>}
                            <input
                                type="password"
                                name="password"
                                placeholder='Create password'
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
                            <div className='checkbox'>
                                <label className="checkbox-label">
                                    <input
                                    type="checkbox"
                                    name="checked"
                                    className="checkbox-input"
                                    checked={input.checked}
                                    onChange={onInputChange}
                                    required
                                    />
                                    <span className="checkbox-text" >Accept <a href='/terms_conditions'>Terms and Conditions</a></span>
                                </label>
                            </div>
                            <FormRulesDialog
                                open={isModalOpen}
                                onClose={() => {
                                    setIsModalOpen(false);
                                    setMessageType(MESSAGE_TYPES.FORM_RULES);
                                }}
                                messageType={messageType}
                            />
                            <button 
                                className='appointment-btn' 
                                type='submit' 
                                onClick={handleSubmit}>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Signup;