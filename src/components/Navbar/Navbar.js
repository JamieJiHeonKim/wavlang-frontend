import React, { useEffect, useState } from 'react';
import './Navbar.scss';
import logo from './../../assets/sitelogo-whitebackground.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import Cookies from 'js-cookie';

const Navbar = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    // const { isLoggedIn, setIsLoggedIn } = useContext(useAuth());
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const userFirstName = Cookies.get('firstName');
    const userLastName = Cookies.get('lastName');
    const userProfileName = userFirstName + ' ' + userLastName;

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const handleLogOut = () => {
        Cookies.remove('access-token');
        Cookies.remove('email');
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        setIsLoggedIn(false);
        navigate('/');
        setDropdownOpen(false);
    };

    useEffect(() => {
        console.log("Authentication state changed. isLoggedIn:", isLoggedIn);
    // }, [useAuth()]);
    }, [isLoggedIn]);


    const navbarItemsLoggedIn = [
        {
            name: 'Home',
            path: '/',
        },
        {
            name: 'Transcribe',
            path: '/transcribe'
        },
        {
            name: 'Pricing',
            path: '/pricing',
        },
        {
            name: 'Updates',
            path: '/updates',
        },
        {
            name: 'Contact Us',
            path: '/contact',
        },
    ];

    const navbarItemsLoggedOut = [
        {
            name: 'Home',
            path: '/',
        },
        {
            name: 'Transcribe',
            path: '/transcribe'
        },
        {
            name: 'Pricing',
            path: '/pricing',
        },
        {
            name: 'Updates',
            path: '/updates',
        },
        {
            name: 'Contact Us',
            path: '/contact',
        },
    ];

    return (
        <div className='main-nav'>
            <div className="container">
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        {/* Logo */}
                        <Link className="navbar-brand" to="/">
                            <img src={logo} alt="logo" />
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {/* Navbar Link */}
                            {isLoggedIn ? (
                                <ul className="navbar-nav m-auto mb-2 mb-lg-0">
                                    { 
                                    navbarItemsLoggedIn.map((navSingle, index) => {
                                        const key = `nav-item-${navSingle.name}-${index}`;
                                        return (
                                            <li className='nav-item' key={key}>
                                                <Link className='nav-link' to={navSingle.path}>{navSingle.name}</Link>
                                            </li>
                                        );
                                    })
                                    }
                                </ul>
                            ) : (
                                <ul className="navbar-nav m-auto mb-2 mb-lg-0">
                                { 
                                    navbarItemsLoggedOut.map((navSingle, index) => {
                                        const key = `nav-item-${navSingle.name}-${index}`;
                                        return (
                                            <li className='nav-item' key={key}>
                                                <Link className='nav-link' to={navSingle.path}>{navSingle.name}</Link>
                                            </li>
                                        );
                                    })
                                    }
                                </ul>
                            )}

                            {isLoggedIn ? (
                                <div className="navbar-account-logged-in">
                                    <button onClick={toggleDropdown} className="user-icon-button">
                                    <span className="user-icon">{userProfileName}</span>
                                    </button>
                                    {isDropdownOpen && (
                                    <div className="account-dropdown">
                                        <button onClick={() => navigate("/dashboard/user")} className="theme-btn">
                                        Dashboard
                                        </button>
                                        <button onClick={handleLogOut} className="theme-btn logout-btn">
                                        Log Out
                                        </button>
                                    </div>
                                    )}
                                </div>
                                ) : (
                                <div className="theme-btn">
                                    <button onClick={() => navigate("/login")} className="user-icon-button">
                                        Login
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;