import React from 'react';
import './SignupPage.scss';
import Navbar from '../components/Navbar/Navbar';
import Signup from './Signup/Signup';
import Footer from '../sections/Footer/Footer';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    return (
        <div className='signup-background'>
            {/* <Navbar /> */}
            <Signup />
            {/* <Footer /> */}
        </div>
    );
};

export default SignupPage;