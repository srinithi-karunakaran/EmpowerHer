import React, { useState } from 'react';
import { TrendingUp, Zap, Sparkles, Share2, ArrowRight, Building2, HeartHandshake } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../utils/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../utils/LanguageContext';

const GrowthToolkit = ({ onBack }) => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('optimizer');
    const [isSaving, setIsSaving] = useState(false);

    // Optimizer State
    const [optimizerData, setOptimizerData] = useState({
        product: 'Handmade Silk Saree',
        currentPrice: 1250,
        cost: 800,
        demand: 'High'
    });
    const [suggestedPrice, setSuggestedPrice] = useState(1450);
    const [isGenerating, setIsGenerating] = useState(false);
    const [postContent, setPostContent] = useState('');

    // Business Data
    const [businessData, setBusinessData] = useState({
        business_name: '',
        sector: '',
        location: '',
        revenue: '',
        stage: 'Startup'
    });

    // Fundraiser Data
    const [fundraiserData, setFundraiserData] = useState({
        title: '',
        description: '',
        goal_amount: '',
        raised_amount: 0
    });

    const handleOptimize = () => {
        setSuggestedPrice(optimizerData.currentPrice + 200);
    };

    const generateSocialPost = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setPostContent(`✨ Pure elegance from the looms of Coimbatore! 🧵 Our latest ${optimizerData.product} collection is now live. Empowering rural artisans with every stitch. 🙏 #EmpowerHer #CoimbatoreSilks #WomenInBusiness`);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <button
                onClick={onBack}
                className="text-muted-text hover:text-primary mb-8 flex items-center gap-2 group transition-colors"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> {t('backToDashboard')}
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-dark-text mb-2 font-serif">{t('growthToolkit')}</h2>
                    <p className="text-muted-text">Scale your business with AI-driven pricing and marketing tools.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-2xl shadow-sm border border-white/10">
                    <button
                        onClick={() => setActiveTab('optimizer')}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'optimizer' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-text hover:text-primary'}`}
                    >
                        Pricing
                    </button>
                    <button
                        onClick={() => setActiveTab('social')}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'social' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-text hover:text-primary'}`}
                    >
                        Social AI
                    </button>
                    <button
                        onClick={() => setActiveTab('business')}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'business' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-text hover:text-primary'}`}
                    >
                        Onboarding
                    </button>
                    <button
                        onClick={() => setActiveTab('fundraiser')}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'fundraiser' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-text hover:text-primary'}`}
                    >
                        Fundraiser
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'optimizer' ? (
                    <motion.div
                        key="optimizer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* Left: Input Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-primary" /> Strategy Parameters
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-text">Product Name</label>
                                        <input
                                            type="text"
                                            value={optimizerData.product}
                                            onChange={(e) => setOptimizerData({ ...optimizerData, product: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 text-dark-text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-text">Market Demand</label>
                                        <select
                                            value={optimizerData.demand}
                                            onChange={(e) => setOptimizerData({ ...optimizerData, demand: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 text-dark-text"
                                        >
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-text">Production Cost (₹)</label>
                                        <input
                                            type="number"
                                            value={optimizerData.cost}
                                            onChange={(e) => setOptimizerData({ ...optimizerData, cost: parseInt(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 text-dark-text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-text">Current Selling Price (₹)</label>
                                        <input
                                            type="number"
                                            value={optimizerData.currentPrice}
                                            onChange={(e) => setOptimizerData({ ...optimizerData, currentPrice: parseInt(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 text-dark-text"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleOptimize}
                                    className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Analyze & Optimize
                                </button>
                            </div>

                            <div className="glass p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                                <h3 className="text-xl font-bold mb-4">Market Comparison</h3>
                                <div className="h-48 bg-white/5 rounded-2xl flex items-end justify-between p-6 gap-4">
                                    <div className="w-full bg-primary/20 rounded-t-lg relative group" style={{ height: '60%' }}>
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold">Your Price</span>
                                    </div>
                                    <div className="w-full bg-accent/20 rounded-t-lg relative" style={{ height: '80%' }}>
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold">Local Market</span>
                                    </div>
                                    <div className="w-full bg-success/20 rounded-t-lg relative" style={{ height: '70%' }}>
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold">Suggested</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Recommendation Sidebar */}
                        <div className="space-y-6">
                            <div className="glass p-8 rounded-3xl bg-primary text-white shadow-xl shadow-primary/20">
                                <p className="text-primary-light text-xs font-bold uppercase tracking-widest mb-2">Optimal Price Point</p>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <h4 className="text-4xl font-bold">₹{suggestedPrice}</h4>
                                    <span className="text-success-light font-bold text-sm">↑ 16.2%</span>
                                </div>
                                <div className="space-y-4 text-sm text-white/80">
                                    <div className="flex gap-3">
                                        <div className="mt-1"><Zap size={14} className="text-secondary" /></div>
                                        <p>Increasing price by ₹200 aligns with market premium for "Handmade" status.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="mt-1"><Zap size={14} className="text-secondary" /></div>
                                        <p>Estimated profit margin increase: <span className="text-white font-bold">+₹145/unit</span></p>
                                    </div>
                                </div>
                                <button className="w-full mt-8 bg-white text-primary py-3 rounded-xl font-bold text-sm">Apply to Catalog</button>
                            </div>

                            <div className="glass p-6 rounded-3xl bg-secondary/10 border border-secondary/20">
                                <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                                    <Sparkles size={16} /> Strategy Tip
                                </h4>
                                <p className="text-xs text-secondary-dark leading-relaxed">
                                    Based on current trends in Tamil Nadu, bundling your silk sarees with ethnic jewelry could justify a <span className="font-bold">25% price increase</span>.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : activeTab === 'social' ? (
                    <motion.div
                        key="social"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl mx-auto"
                    >
                        {/* Summary: Pre-existing Social AI content preserved here */}
                        <div className="glass p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 text-center">
                            <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent mx-auto mb-6">
                                <Share2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">AI Social Post Generator</h3>
                            <p className="text-muted-text mb-8">Generate professional, SEO-friendly posts for Instagram, Facebook, and WhatsApp in seconds.</p>

                            <div className="space-y-4 text-left mb-8">
                                <label className="text-sm font-bold text-muted-text ml-2">What's the occasion?</label>
                                <input
                                    type="text"
                                    placeholder="e.g. New Summer Handloom Collection Launch"
                                    className="w-full bg-white/5 border border-white/10 text-dark-text rounded-2xl p-5 focus:ring-2 focus:ring-accent/20"
                                />
                            </div>

                            <button
                                onClick={generateSocialPost}
                                disabled={isGenerating}
                                className="bg-accent text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                            >
                                {isGenerating ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Sparkles size={20} /> Generate Viral Post
                                    </>
                                )}
                            </button>

                            {postContent && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-10 p-8 bg-white/5 border border-white/5 rounded-3xl text-left relative"
                                >
                                    <p className="text-sm text-dark-text leading-relaxed italic opacity-80">
                                        {postContent}
                                    </p>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button className="text-xs font-bold text-accent bg-accent/10 px-4 py-2 rounded-lg">Copy to Clipboard</button>
                                        <button className="text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-lg">Share to WhatsApp</button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ) : activeTab === 'business' ? (
                    <motion.div
                        key="business"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-4xl mx-auto glass p-8 rounded-[2rem] bg-white/[0.03] border border-white/10"
                    >
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Building2 className="text-primary" /> Business Onboarding
                        </h3>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={async (e) => {
                            e.preventDefault();
                            if (!user) return;
                            setIsSaving(true);
                            const { error } = await supabase.from('business_profiles').insert([{ ...businessData, user_id: user.id }]);
                            setIsSaving(false);
                            if (error) alert(error.message);
                            else alert("Business Profile Saved!");
                        }}>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-text uppercase">Business Name</label>
                                <input type="text" required value={businessData.business_name} onChange={e => setBusinessData({ ...businessData, business_name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-text uppercase">Sector</label>
                                <input type="text" required value={businessData.sector} onChange={e => setBusinessData({ ...businessData, sector: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-text uppercase">Location</label>
                                <input type="text" required value={businessData.location} onChange={e => setBusinessData({ ...businessData, location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-text uppercase">Annual Revenue (₹)</label>
                                <input type="number" required value={businessData.revenue} onChange={e => setBusinessData({ ...businessData, revenue: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                            </div>
                            <div className="md:col-span-2">
                                <button disabled={isSaving} className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
                                    {isSaving ? "Saving..." : "Submit Profile"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="fundraiser"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-4xl mx-auto glass p-8 rounded-[2rem] bg-white/[0.03] border border-white/10"
                    >
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <HeartHandshake className="text-accent" /> Start a Fundraiser
                        </h3>
                        <form className="space-y-6" onSubmit={async (e) => {
                            e.preventDefault();
                            if (!user) return;
                            setIsSaving(true);
                            const { error } = await supabase.from('fundraisers').insert([{ ...fundraiserData, user_id: user.id }]);
                            setIsSaving(false);
                            if (error) alert(error.message);
                            else alert("Fundraiser Created!");
                        }}>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-text uppercase">Campaign Title</label>
                                <input type="text" required value={fundraiserData.title} onChange={e => setFundraiserData({ ...fundraiserData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-text uppercase">Description</label>
                                <textarea required value={fundraiserData.description} onChange={e => setFundraiserData({ ...fundraiserData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-32" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-text uppercase">Goal Amount (₹)</label>
                                <input type="number" required value={fundraiserData.goal_amount} onChange={e => setFundraiserData({ ...fundraiserData, goal_amount: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
                            </div>
                            <button disabled={isSaving} className="w-full bg-accent text-white py-4 rounded-xl font-bold shadow-lg shadow-accent/20">
                                {isSaving ? "Creating..." : "Launch Campaign"}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GrowthToolkit;
