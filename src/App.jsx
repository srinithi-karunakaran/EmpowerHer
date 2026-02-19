import { useState } from 'react'
import { Rocket, Scale, Users, TrendingUp, MessageSquare, CreditCard } from 'lucide-react'
import Navbar from './components/Navbar'
import DashboardHero from './components/DashboardHero'
import ModuleCard from './components/ModuleCard'
import QuickStats from './components/QuickStats'
import PitchAI from './components/PitchAI'
import LegalTax from './components/LegalTax'
import Community from './components/Community'
import GrowthToolkit from './components/GrowthToolkit'
import Pricing from './components/Pricing'
import Login from './components/Login'
import Signup from './components/Signup'
import { useLanguage } from './utils/LanguageContext'
import { useAuth } from './utils/AuthContext'

function App() {
    const [activePage, setActivePage] = useState('dashboard')
    const [authMode, setAuthMode] = useState('signup') // Default to signup per user request
    const { user, loading } = useAuth()
    const { t } = useLanguage()

    const modules = [
        {
            id: 'pitch-ai',
            title: t('pitchAi'),
            desc: t('pitchDesc'),
            icon: <Rocket className="text-primary" />,
            progress: 84
        },
        {
            id: 'legal-tax',
            title: t('legalTax'),
            desc: t('legalDesc'),
            icon: <Scale className="text-secondary" />,
            progress: 100
        },
        {
            id: 'community',
            title: t('community'),
            desc: t('communityDesc'),
            icon: <Users className="text-accent" />,
            progress: 45
        },
        {
            id: 'growth-toolkit',
            title: t('growthToolkit'),
            desc: t('growthDesc'),
            icon: <TrendingUp className="text-success" />,
            progress: 60
        },
    ]

    const handleModuleClick = (id) => {
        setActivePage(id)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!user) {
        return authMode === 'login' ? (
            <Login onSwitchToSignup={() => setAuthMode('signup')} />
        ) : (
            <Signup onSwitchToLogin={() => setAuthMode('login')} />
        )
    }

    return (
        <div className="min-h-screen bg-neutral-bg text-dark-text">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activePage === 'dashboard' ? (
                    <>
                        <DashboardHero userName={user.displayName} growthScore={78} />

                        <QuickStats />

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-dark-text">{t('modules')}</h3>
                            <div className="flex gap-4 items-center">
                                <button
                                    onClick={() => setActivePage('pricing')}
                                    className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-xl text-sm font-bold hover:bg-secondary/20 transition-all"
                                >
                                    <CreditCard size={16} /> {t('pricing')}
                                </button>
                                <button className="text-primary text-sm font-bold hover:underline">{t('viewRoadmap')}</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {modules.map((module) => (
                                <ModuleCard
                                    key={module.id}
                                    title={module.title}
                                    desc={module.desc}
                                    icon={module.icon}
                                    progress={module.progress}
                                    onClick={() => handleModuleClick(module.id)}
                                />
                            ))}
                        </div>
                    </>
                ) : activePage === 'pitch-ai' ? (
                    <PitchAI onBack={() => setActivePage('dashboard')} />
                ) : activePage === 'legal-tax' ? (
                    <LegalTax onBack={() => setActivePage('dashboard')} />
                ) : activePage === 'community' ? (
                    <Community onBack={() => setActivePage('dashboard')} />
                ) : activePage === 'growth-toolkit' ? (
                    <GrowthToolkit onBack={() => setActivePage('dashboard')} />
                ) : activePage === 'pricing' ? (
                    <Pricing onBack={() => setActivePage('dashboard')} />
                ) : (
                    <div className="py-20 text-center">
                        <h2 className="text-2xl font-bold text-gray-400">Section Under Construction</h2>
                        <button
                            onClick={() => setActivePage('dashboard')}
                            className="mt-4 text-primary hover:underline"
                        >
                            {t('backToDashboard')}
                        </button>
                    </div>
                )}
            </main>

            {/* AI Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50">
                <button className="w-16 h-16 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative">
                    <MessageSquare size={28} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white animate-bounce"></span>

                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 bg-dark-text text-white text-xs py-2 px-3 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {t('askAi')}
                    </div>
                </button>
            </div>
        </div>
    )
}

export default App
