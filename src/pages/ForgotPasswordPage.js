import React from 'react';
import './LoginPage.scss';
import Navbar from '../components/Navbar/Navbar';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import Footer from '../sections/Footer/Footer';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    return (
        <div className='login-background'>
            {/* <Navbar /> */}
            <ForgotPassword />
            {/* <Footer /> */}
        </div>
    );
};

export default ForgotPasswordPage;