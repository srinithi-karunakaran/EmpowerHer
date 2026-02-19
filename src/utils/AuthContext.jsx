import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUserApi, getUserProfileApi } from './api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const savedUser = localStorage.getItem('empowerher_user');
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                try {
                    // Sync with backend on mount
                    const profile = await getUserProfileApi(parsed.firebaseId || parsed.uid);
                    setUser({ ...parsed, ...profile });
                } catch (err) {
                    console.warn("Backend sync failed, using local session");
                    setUser(parsed);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        // Mocking login but fetching user record from DB
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                if (email && password) {
                    const mockFirebaseId = `user_${btoa(email).slice(0, 10)}`;
                    try {
                        const profile = await getUserProfileApi(mockFirebaseId);
                        const userData = { ...profile, email };
                        setUser(userData);
                        localStorage.setItem('empowerher_user', JSON.stringify(userData));
                        resolve(userData);
                    } catch (err) {
                        // Fallback/Demo user
                        const demoUser = { uid: mockFirebaseId, firebaseId: mockFirebaseId, email, displayName: 'Priya', industry: 'Textiles' };
                        setUser(demoUser);
                        localStorage.setItem('empowerher_user', JSON.stringify(demoUser));
                        resolve(demoUser);
                    }
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 800);
        });
    };

    const signup = async (email, password, name, industry) => {
        const firebaseId = `user_${Date.now()}`;
        const userData = {
            firebaseId,
            email,
            name,
            industry
        };

        try {
            await createUserApi(userData);
            const userWithDisplayName = { ...userData, uid: firebaseId, displayName: name };
            setUser(userWithDisplayName);
            localStorage.setItem('empowerher_user', JSON.stringify(userWithDisplayName));
            return userWithDisplayName;
        } catch (err) {
            console.error("Signup Persistence Error:", err);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('empowerher_user');
    };

    const value = { user, login, signup, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
