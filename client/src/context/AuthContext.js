import { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// This provides login info to the whole app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );

    // Call this when user logs in
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    // Call this when user logs out
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use this context easily
export const useAuth = () => useContext(AuthContext);