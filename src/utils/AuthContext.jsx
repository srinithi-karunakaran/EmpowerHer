import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Mock user for dev testing to bypass rate limits
    const [user, setUser] = useState({
        id: 'demo-user-123',
        email: 'demo@empowerher.com',
        name: 'Demo User',
        displayName: 'Demo User',
        role: 'ENTREPRENEUR'
    });
    const [loading, setLoading] = useState(false);

    /*
    useEffect(() => {
        // Check active session
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Fetch user profile from public.users table
                const { data: profile, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    setUser({ ...session.user, ...profile });
                } else {
                    setUser(session.user);
                }
            }
            setLoading(false);
        };

        initSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                setUser({ ...session.user, ...profile });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);
    */

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data.user;
    };

    const signup = async (email, password, name, language = 'en') => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    language: language
                }
            }
        });

        if (error) throw error;

        if (data.user) {
            // Create user profile in 'users' table
            const { error: profileError } = await supabase
                .from('users')
                .insert([
                    {
                        id: data.user.id,
                        name: name,
                        email: email,
                        language: language
                    }
                ]);

            if (profileError) console.error("Profile creation error:", profileError);
        }

        return data.user;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout error:", error);
    };

    const value = { user, login, signup, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
