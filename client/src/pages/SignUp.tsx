// SignUp.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        const auth = getAuth();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setMessage('Account created! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500); // redirect after 1.5s
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setMessage('An unexpected error occurred.');
            }
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleSignUp}>Create Account</button>
            <p>{message}</p>
        </div>
    );
};

export default SignUp;
