import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(Cookies.get('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [loading, setLoading] = useState(true); // For initial token check

    useEffect(() => {
        // You might want to add logic here to verify the token with the backend on app load
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            setToken(res.data.token);
            Cookies.set('token', res.data.token, { expires: 1 / 24 }); // Expires in 1 hour
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            console.error('Login failed:', err.response?.data?.msg || err.message);
            setIsAuthenticated(false);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        Cookies.remove('token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);