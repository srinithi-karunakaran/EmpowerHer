import React from 'react';
import { TrendingUp, Sparkles, Target } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

const DashboardHero = ({ userName, growthScore }) => {
    const { t } = useLanguage();

    return (
        <div className="relative overflow-hidden glass p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1E293B] to-[#0B1120] text-white shadow-2xl shadow-black/50 mb-8 border border-white/5">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="text-secondary animate-pulse" size={20} />
                        <span className="text-white/80 text-sm font-bold uppercase tracking-widest">{t('welcome')}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4 flex items-center gap-3">
                        {userName}! <span className="animate-wave inline-block">👋</span>
                    </h2>
                    <p className="text-white/70 max-w-md text-lg leading-relaxed">
                        Your venture is growing. You've completed <span className="text-secondary font-bold">12 milestones</span> this week!
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 flex items-center gap-6 shadow-xl w-full md:w-auto">
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                            <circle cx="48" cy="48" r="40" stroke="#FFD700" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - growthScore / 100)} className="transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-bold leading-none">{growthScore}%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">{t('growthScore')}</p>
                        <div className="flex items-center gap-2 text-secondary font-bold">
                            <TrendingUp size={16} />
                            <span>+12% vs last month</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-secondary/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-20%] left-[-5%] w-48 h-48 bg-accent/20 rounded-full blur-[60px]"></div>
        </div>
    );
};

export default DashboardHero;
