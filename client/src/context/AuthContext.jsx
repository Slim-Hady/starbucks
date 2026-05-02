import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await api.getMe();
            setUser(data.data.user);
        } catch (err) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback(async (email, password) => {
        setError('');
        setLoading(true);
        try {
            const data = await api.login({ email, password });
            setUser(data.data.user);
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
            setLoading(false);
            return false;
        }
    }, []);

    const signup = useCallback(async (userData) => {
        setError('');
        setLoading(true);
        try {
            const data = await api.signup(userData);
            setUser(data.data.user);
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
            setLoading(false);
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        api.logout();
        setUser(null);
        setError('');
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                loading,
                error,
                login,
                signup,
                logout,
                setError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
    return ctx;
}