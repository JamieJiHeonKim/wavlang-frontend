import React from 'react';
import './SignupPage.scss';
import Navbar from '../components/Navbar/Navbar';
import ResetPassword from './ResetPassword/ResetPassword';
import Footer from '../sections/Footer/Footer';
import { Link } from 'react-router-dom';

const ResetPasswordPage = () => {
    return (
        <div className='signup-background'>
            {/* <Navbar /> */}
            <ResetPassword />
            {/* <Footer /> */}
        </div>
    );
};

export default ResetPasswordPage;