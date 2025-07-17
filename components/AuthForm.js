import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';
import './AuthForm.css'; // For styling

const AuthForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth(); // Only using login here, register would be similar via backend
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (isRegister) {
            try {
                await axios.post('http://localhost:5000/api/auth/register', { username, password });
                const success = await login(username, password); // Log in after registering
                if (success) {
                    history.push('/gallery');
                } else {
                    setError('Registration successful, but login failed. Please try logging in.');
                }
            } catch (err) {
                setError(err.response?.data?.msg || 'Registration failed');
            }
        } else {
            const success = await login(username, password);
            if (success) {
                history.push('/gallery');
            } else {
                setError('Invalid username or password');
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>{isRegister ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <p>
                {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
                <span onClick={() => setIsRegister(!isRegister)} className="toggle-auth">
                    {isRegister ? 'Login here' : 'Register here'}
                </span>
            </p>
        </div>
    );
};

export default AuthForm;