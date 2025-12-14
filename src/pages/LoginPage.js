import React from 'react';
import './LoginPage.scss';
import Navbar from '../components/Navbar/Navbar';
import LoginForm from './Login/LoginForm';
import Footer from '../sections/Footer/Footer';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div className='login-background'>
            {/* <Navbar /> */}
            <LoginForm />
            {/* <Footer /> */}
        </div>
    );
};

export default LoginPage;