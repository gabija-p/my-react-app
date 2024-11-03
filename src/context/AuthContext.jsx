import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [expiry, setExpiry] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedExpiry = localStorage.getItem('expiry');

        if (storedUser && new Date() < new Date(storedExpiry)) {
            setUser(JSON.parse(storedUser));
            setExpiry(storedExpiry);
            navigate("/table");
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('expiry');
        }
    }, []);

    const logIn = (userData, sessionDuration) => {
        const expiryDate = new Date(new Date().getTime() + sessionDuration);
        setUser(userData);
        setExpiry(expiryDate);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('expiry', expiryDate);
    };

    const logOut = () => {
        setUser(null);
        setExpiry(null);
        localStorage.removeItem('user');
        localStorage.removeItem('expiry');
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);