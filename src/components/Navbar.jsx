import React from 'react';
import { Bell, Search, Globe, LogOut } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
    const { t, language, toggleLanguage } = useLanguage();
    const { user, logout } = useAuth();

    return (
        <header className="glass sticky top-0 z-50 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-white font-bold text-xl">E</span>
                    </div>
                    <h1 className="text-2xl font-bold font-serif text-dark-text hidden sm:block tracking-tight">EmpowerHer</h1>
                </div>

                <div className="flex-1 max-w-md mx-8 hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="w-full bg-white/5 border border-white/10 text-dark-text rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-text/50"
                            onKeyDown={(e) => e.key === 'Enter' && alert(`Searching for: ${e.target.value}`)}
                        />
                    </div>
                </div>

                <nav className="flex items-center gap-4 sm:gap-6">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 text-muted-text hover:text-primary transition-colors font-bold text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/5"
                    >
                        <Globe size={18} />
                        <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
                    </button>

                    <button
                        onClick={() => alert("No new notifications")}
                        className="relative text-muted-text hover:text-primary transition-colors"
                    >
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border-2 border-neutral-bg"></span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {user?.displayName?.charAt(0) || 'P'}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={logout}
                            title={t('logout')}
                            className="text-muted-text hover:text-accent transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
