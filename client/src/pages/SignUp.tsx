// SignUp.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorOccurred, setErrorOccurred] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getFirebaseSignupErrorMessage = (code: string): string => {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/missing-password':
                return 'Password is required.';
            case 'auth/operation-not-allowed':
                return 'Signup is currently disabled. Contact support.';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please wait and try again later.';
            default:
                return 'Something went wrong. Please try again.';
        }
    };

    const handleSignUp = async () => {
        if (!email || !password) {
            setMessage('Please fill in all fields.');
            setErrorOccurred(true);
            return;
        }

        const auth = getAuth();
        setLoading(true);
        setErrorOccurred(false);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setMessage('Account created! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                const friendlyMessage = getFirebaseSignupErrorMessage(error.code);
                setMessage(friendlyMessage);
            } else {
                setMessage('An unexpected error occurred.');
            }
            setErrorOccurred(true);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp} disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
            </button>
            <p>{message}</p>
            {errorOccurred && (
                <button onClick={() => navigate('/login')}>
                    Back to Login
                </button>
            )}
        </div>
    );
};

export default SignUp;