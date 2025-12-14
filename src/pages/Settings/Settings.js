import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext/AuthContext';
import { Link } from 'react-router-dom';
import './Settings.scss';

const Settings = () => {
    const { user, setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [billingInfo, setBillingInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            
            setBillingInfo(user.billingInfo || {});
        }
    }, [user]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const updateProfile = async () => {
        try {
            const response = await axios.put('/api/user/profile', { email, password, billingInfo });
            setUser(response.data);
            alert('Profile updated successfully.');
        } catch (error) {
            console.error('There was an error updating the profile', error);
            alert('There was an error updating the profile.');
        }
    };

    return (
        <div className='settings-content' data-aos="fade-up" data-aos-duration="1500">
            <section className="settings-section">
                <div className="container">
                    <h2 className="settings-title">User Settings</h2>
                    <div className="settings-form">
                        <label>Email:</label>
                        <input type="email" value={email} onChange={handleEmailChange} />
                        
                        <label>Password:</label>
                        <input type="password" value={password} onChange={handlePasswordChange} />
                        
                        <label>Card Number:</label>
                        <input type="text" name="cardNumber" value={billingInfo.cardNumber} onChange={handleBillingChange} />
                        
                        <label>Expiry Date:</label>
                        <input type="text" name="expiryDate" value={billingInfo.expiryDate} onChange={handleBillingChange} />
                        
                        <label>CVV:</label>
                        <input type="text" name="cvv" value={billingInfo.cvv} onChange={handleBillingChange} />
                        
                        <button onClick={updateProfile} className="update-profile-btn">Update Profile</button>
                    </div>
                    <div className='back-home-btn'>
                        <Link to="/">Back to Homepage</Link>
                    </div>
                </div>
            </section>
        </div>        
    );
};

export default Settings;
