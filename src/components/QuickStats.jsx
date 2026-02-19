import React from 'react';
import { TrendingUp, Target, Activity, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

const QuickStats = () => {
    const { t } = useLanguage();

    const stats = [
        { label: t('fundingMatches'), value: '4', change: '+2 new', icon: <Target className="text-primary" />, bg: 'bg-primary/10', iconColor: 'text-primary' },
        { label: t('cashRunway'), value: '8.5 months', change: 'Optimized', icon: <Activity className="text-secondary" />, bg: 'bg-secondary/10', iconColor: 'text-secondary' },
        { label: t('pricingOptimization'), value: '₹140 -> ₹165', change: t('optimized'), icon: <TrendingUp className="text-success" />, bg: 'bg-success/10', iconColor: 'text-success' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, i) => (
                <div key={i} className="glass p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.iconColor}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-muted-text text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                            <h4 className="text-xl font-bold text-dark-text">{stat.value}</h4>
                        </div>
                    </div>
                    <div className="bg-success/10 text-success text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <ArrowUpRight size={12} /> {stat.change}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuickStats;
