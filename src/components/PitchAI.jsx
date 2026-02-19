import React, { useState } from 'react';
import { Rocket, FileText, Download, CheckCircle2, ChevronRight, AlertCircle, Info, Sparkles, Flame, TrendingUp, Zap, Layout, Mic, BarChart3, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzePitchApi } from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import { supabase } from '../utils/supabaseClient';

const PitchAI = ({ onBack }) => {
    const { user } = useAuth();
    const [pitch, setPitch] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [activeTab, setActiveTab] = useState('summary'); // summary, slides, script, insights
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        if (!pitch.trim()) return;
        setIsAnalyzing(true);
        setError(null);
        try {
            const result = await analyzePitchApi(pitch, user?.id);
            setAnalysisResult(result);
            setActiveTab('summary');

            // Save to Supabase ai_conversations
            if (user) {
                const { error: dbError } = await supabase
                    .from('ai_conversations')
                    .insert([
                        {
                            user_id: user.id,
                            question: pitch,
                            answer: JSON.stringify(result)
                        }
                    ]);
                if (dbError) console.error("Error saving conversation:", dbError);
            }
        } catch (err) {
            console.error(err);
            setError("AI service is busy. Please try again later.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleDownload = (type) => {
        if (!analysisResult) return;

        let content = "";
        let filename = "";

        if (type === 'pptx') {
            content = `EMPOWERHER PITCH DECK STRUCTURE - ${user?.name || 'Entrepreneur'}\n\n`;
            analysisResult.slides.forEach((slide, i) => {
                content += `SLIDE ${i + 1}: ${slide.title}\n-------------------\n${slide.content}\n\n`;
            });
            filename = "EmpowerHer_Deck_Structure.txt";
        } else {
            content = `EMPOWERHER STRATEGY PDF (TEXT SUMMARY)\nScore: ${analysisResult.score}/100\n\nIMPROVEMENTS:\n${analysisResult.improvements.join('\n')}\n\n---\n\n2-MINUTE SCRIPT:\n${analysisResult.script}`;
            filename = "EmpowerHer_Strategy_Full.txt";
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <button
                onClick={onBack}
                className="text-muted-text hover:text-primary mb-6 flex items-center gap-2 group transition-colors"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
            </button>

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-dark-text mb-2 font-serif text-white">Pitch Perfection AI</h2>
                <p className="text-muted-text">From rough idea to investor-ready deck in seconds.</p>
            </div>

            {!analysisResult ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="glass p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                            <label className="block text-sm font-bold text-muted-text uppercase tracking-widest mb-3">Your Pitch Content</label>
                            <textarea
                                value={pitch}
                                onChange={(e) => setPitch(e.target.value)}
                                placeholder="Paste your business idea or draft script here..."
                                className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary focus:ring-0 transition-all resize-none text-dark-text placeholder:text-muted-text/30"
                            />
                            <button
                                onClick={handleAnalyze}
                                disabled={!pitch || isAnalyzing}
                                className="w-full mt-6 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all"
                            >
                                {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Zap size={20} />}
                                {isAnalyzing ? 'Analyzing Strategy...' : 'Analyze & Generate Assets'}
                            </button>
                        </div>
                    </div>
                    <div className="lg:col-span-1 glass p-8 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-muted-text/20 mb-4">
                            <BarChart3 size={32} />
                        </div>
                        <p className="text-sm text-muted-text italic">"Ready for TN Angel Network demo day!"</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Scores & Tabs */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1 glass p-6 rounded-3xl bg-primary/10 border border-primary/20">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Overall Score</p>
                            <p className="text-5xl font-bold text-white font-serif">{analysisResult.score}<span className="text-xl opacity-30">/100</span></p>
                            <p className="text-xs text-primary/80 mt-2 font-bold">"Ready for Demo Day!"</p>
                        </div>

                        <div className="lg:col-span-3 glass p-2 rounded-[2rem] bg-white/[0.02] border border-white/10 flex flex-wrap">
                            <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={<BarChart3 size={18} />} label="Summary" />
                            <TabButton active={activeTab === 'slides'} onClick={() => setActiveTab('slides')} icon={<Layout size={18} />} label="10-Slide Deck" />
                            <TabButton active={activeTab === 'script'} onClick={() => setActiveTab('script')} icon={<Mic size={18} />} label="2-Min Script" />
                            <TabButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<Sparkles size={18} />} label="Psychology" />
                        </div>
                    </div>

                    {/* Active Content */}
                    <div className="min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'summary' && (
                                <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="glass p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                                                <AlertCircle size={20} className="text-accent" /> Critical Improvements
                                            </h3>
                                            <div className="space-y-3">
                                                {analysisResult.improvements.map((imp, i) => (
                                                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-sm text-dark-text opacity-90">
                                                        {imp}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="glass p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                                            <h3 className="text-lg font-bold mb-4 text-white">Before vs After</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] uppercase text-muted-text font-bold">Original</p>
                                                    <div className="p-3 bg-white/5 rounded-xl text-[10px] opacity-40 line-clamp-6">{pitch}</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] uppercase text-primary font-bold">Refined (GPT-o)</p>
                                                    <div className="p-3 bg-primary/5 rounded-xl text-[10px] text-primary/90 line-clamp-6 italic">{analysisResult.refinedText}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="glass p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                                            <h3 className="text-lg font-bold mb-6 text-white text-center">Investor Psychology Heatmap</h3>
                                            <div className="space-y-4">
                                                {analysisResult.psychologyHeatmap.map((item, i) => (
                                                    <div key={i} className="space-y-1">
                                                        <div className="flex justify-between text-[10px] font-bold uppercase text-muted-text">
                                                            <span>{item.section}</span>
                                                            <span>Interest: {(item.interestLevel * 100).toFixed(0)}%</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full truncate text-[10px] flex items-center justify-center transition-all duration-1000 ${item.interestLevel > 0.8 ? 'bg-green-500' : item.interestLevel > 0.6 ? 'bg-primary' : 'bg-accent'
                                                                    }`}
                                                                style={{ width: `${item.interestLevel * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="glass p-6 rounded-3xl bg-white/[0.03] border border-white/10 shadow-lg shadow-black/20">
                                            <h4 className="font-bold flex items-center gap-2 mb-4 text-white">
                                                <Download size={18} /> Export Assets
                                            </h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                <button
                                                    onClick={() => handleDownload('pptx')}
                                                    className="w-full bg-white/5 hover:bg-white/10 text-white text-sm py-4 rounded-xl flex items-center justify-between px-6 border border-white/10"
                                                >
                                                    <span className="flex items-center gap-2"><Layout size={16} className="text-primary" /> 10-Slide Deck (Structure)</span>
                                                    <Download size={16} className="opacity-40" />
                                                </button>
                                                <button
                                                    onClick={() => handleDownload('pdf')}
                                                    className="w-full bg-white/5 hover:bg-white/10 text-white text-sm py-4 rounded-xl flex items-center justify-between px-6 border border-white/10"
                                                >
                                                    <span className="flex items-center gap-2"><FileText size={16} className="text-secondary" /> Full Strategy Doc</span>
                                                    <Download size={16} className="opacity-40" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'slides' && (
                                <motion.div key="slides" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                        {analysisResult.slides.map((slide, i) => (
                                            <div key={i} className="aspect-[4/3] glass p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col group hover:border-primary/50 transition-all cursor-pointer">
                                                <p className="text-[10px] font-bold text-primary mb-2">SLIDE {i + 1}</p>
                                                <h4 className="text-xs font-bold text-white mb-2 line-clamp-2">{slide.title}</h4>
                                                <p className="text-[8px] text-muted-text line-clamp-4 leading-relaxed">{slide.content}</p>
                                                <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="text-[8px] font-bold text-primary">View Full →</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'script' && (
                                <motion.div key="script" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/20 max-w-2xl mx-auto shadow-2xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                                                <Mic size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">2-Minute Pitch Script</h3>
                                                <p className="text-xs text-indigo-300">With delivery cues and timing</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-white">02:00</div>
                                            <div className="text-[10px] text-indigo-400 uppercase font-black">Target Length</div>
                                        </div>
                                    </div>
                                    <div className="bg-black/20 p-6 rounded-3xl border border-white/5 space-y-4">
                                        {analysisResult.script.split('\n').map((line, i) => (
                                            <p key={i} className="text-indigo-100 leading-relaxed font-serif italic text-lg opacity-90">
                                                {line.includes('[') ? (
                                                    <span className="inline-flex bg-indigo-500/20 text-indigo-100 text-[10px] px-2 py-0.5 rounded font-sans not-italic mr-2 align-middle">{line.match(/\[(.*?)\]/)[0]}</span>
                                                ) : null}
                                                {line.replace(/\[.*?\]/, '')}
                                            </p>
                                        ))}
                                    </div>
                                    <p className="mt-6 text-xs text-center text-muted-text italic">"Pro Tip: Maintain eye contact during the Solution reveal at 0:45."</p>
                                </motion.div>
                            )}

                            {activeTab === 'insights' && (
                                <motion.div key="insights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 rounded-[3rem] bg-gradient-to-br from-indigo-900/10 to-transparent flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <Sparkles size={48} />
                                    </div>
                                    <div className="max-w-xl">
                                        <h3 className="text-2xl font-bold text-white mb-2">Investor Psychology Breakdown</h3>
                                        <p className="text-muted-text italic">
                                            "Your pitch hits the emotional high early. Investors are likely to peak in interest during the Solution reveal,
                                            but might cool down if market data isn't specific to Tamil Nadu rural segments."
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 text-sm font-bold text-success">Peak: Solution Phase</div>
                                        <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 text-sm font-bold text-accent">Lull: Team Background</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl transition-all duration-300 ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-text hover:text-white hover:bg-white/5'}`}
    >
        <span className={active ? 'scale-110' : ''}>{icon}</span>
        <span className="text-sm font-bold">{label}</span>
    </button>
);

export default PitchAI;
