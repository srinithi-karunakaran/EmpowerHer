import React from 'react';

const ModuleCard = ({ title, desc, icon, progress, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="glass p-6 rounded-2xl hover:translate-y-[-4px] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/[0.03] border border-white/5"
        >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 shadow-none border border-white/5 group-hover:bg-primary/20 transition-all">
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <h3 className="text-lg font-bold mb-1 text-dark-text group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-sm text-muted-text mb-4 h-10 overflow-hidden line-clamp-2">{desc}</p>

            <div className="space-y-2">
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(57,131,216,0.5)]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted-text font-bold uppercase tracking-wider">Progress</span>
                    <span className="text-[10px] text-primary font-bold">{progress}%</span>
                </div>
            </div>
        </div>
    );
};

export default ModuleCard;
