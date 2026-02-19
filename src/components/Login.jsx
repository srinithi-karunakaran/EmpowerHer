import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import { LogIn, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

const Login = ({ onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { t } = useLanguage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            alert(err.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-bg relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-4">
                        <span className="text-white font-bold text-3xl">E</span>
                    </div>
                    <h1 className="text-3xl font-bold font-serif text-dark-text tracking-tight">EmpowerHer</h1>
                    <p className="text-muted-text mt-2">Elite platform for women entrepreneurs</p>
                </div>

                <div className="glass p-8 rounded-[2rem] border border-white/10 shadow-2xl shadow-black/50">
                    <h2 className="text-xl font-bold text-dark-text mb-6 flex items-center gap-2">
                        <LogIn size={20} className="text-primary" /> Welcome Back
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-text uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-dark-text focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-text/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between px-1">
                                <label className="text-xs font-bold text-muted-text uppercase tracking-widest">Password</label>
                                <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-dark-text focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-text/30"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-4 group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Login to Dashboard</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-muted-text">
                            New to the circle?
                            <button
                                onClick={onSwitchToSignup}
                                className="text-secondary font-bold ml-2 hover:underline"
                            >
                                Create an account
                            </button>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-6 text-muted-text/40">
                    <div className="flex items-center gap-1.5 grayscale opacity-50">
                        <Sparkles size={14} /> <span className="text-[10px] font-bold tracking-widest uppercase">Safe & Secure</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
