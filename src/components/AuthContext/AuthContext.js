
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [, forceUpdate] = useState();
    const loginAuth = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        forceUpdate({});
    };

    useEffect(() => {
        const verifyToken = async () => {
            const userToken = Cookies.get('access-token');
            const userEmail = Cookies.get('email');
            if (!userToken || !userEmail) {
                setIsLoggedIn(false);
                setUser(null);
            }
            try {
                console.log("userToken:", userToken);
                const decoded = jwtDecode(userToken);
                console.log('decoded:', decoded);
                console.log('email:', userEmail);
                const response = await axios.get('http://localhost:8080/api/user/authenticated', {
                    headers: { 
                        'x-access-token': decoded.userId,
                        'email': userEmail
                    }
                });
                setIsLoggedIn(true);
                setUser(response.data.data);
            } catch (error) {
                setIsLoggedIn(false);
                setUser(null);
            }
        };
        const userToken = Cookies.get('access-token');
        if(userToken) {
            verifyToken();
        }
    }, [Cookies.get('access-token')]);

    const value = {
        isLoggedIn,
        user,
        setIsLoggedIn,
        setUser,
        loginAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);