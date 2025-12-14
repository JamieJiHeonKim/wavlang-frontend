import { React } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleAuth = () => {
    const handleSuccess = (credentialResponse) => {
        const authorizationCode = credentialResponse.code;

        fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: authorizationCode
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Login successful, backend response:', data);
        })
        .catch(error => {
            console.error('Error exchanging authorization code:', error);
        });
    };
    
    const handleError = (errorResponse) => {
        console.log('Google login failed', errorResponse);
    }
    
    return (
        <div>
            <GoogleLogin 
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                flow='auth-code'
            />
        </div>
    );
};

export default GoogleAuth;