import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import { UserPlus, Mail, Lock, User, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

const Signup = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        industry: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signup(formData.email, formData.password, formData.name, formData.industry);
        } catch (err) {
            alert("Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-bg relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl shadow-xl shadow-secondary/20 mb-4">
                        <span className="text-white font-bold text-3xl">E</span>
                    </div>
                    <h1 className="text-3xl font-bold font-serif text-dark-text tracking-tight">Join EmpowerHer</h1>
                    <p className="text-muted-text mt-2">Start your entrepreneurial journey with VIP tools</p>
                </div>

                <div className="glass p-8 rounded-[2rem] border border-white/10 shadow-2xl shadow-black/50">
                    <h2 className="text-xl font-bold text-dark-text mb-6 flex items-center gap-2">
                        <UserPlus size={20} className="text-secondary" /> Create Profile
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-text uppercase tracking-widest px-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-secondary transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Priya Sharma"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-dark-text focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-muted-text/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-text uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-secondary transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-dark-text focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-muted-text/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-text uppercase tracking-widest px-1">Industry</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-secondary transition-colors" size={18} />
                                <select
                                    required
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-dark-text focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all appearance-none"
                                >
                                    <option value="" className="bg-[#0B1120]">Select Industry</option>
                                    <option value="Textiles" className="bg-[#0B1120]">Textiles & Handloom</option>
                                    <option value="Agriculture" className="bg-[#0B1120]">Agri-business</option>
                                    <option value="Education" className="bg-[#0B1120]">Ed-Tech / Training</option>
                                    <option value="Crafts" className="bg-[#0B1120]">Handicrafts</option>
                                    <option value="Services" className="bg-[#0B1120]">Business Services</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-text uppercase tracking-widest px-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-secondary transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Minimum 8 characters"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-dark-text focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-muted-text/30"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-secondary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 mt-6 group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Register Member</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-muted-text">
                            Already a member?
                            <button
                                onClick={onSwitchToLogin}
                                className="text-primary font-bold ml-2 hover:underline"
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
