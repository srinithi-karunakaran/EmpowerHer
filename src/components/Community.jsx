import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Video, Star, MapPin, Zap, ArrowRight, Heart, Share2, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import { supabase } from '../utils/supabaseClient';

const Community = ({ onBack }) => {
    const [matching, setMatching] = useState(false);
    const [matchedMentor, setMatchedMentor] = useState(null);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    useEffect(() => {
        fetchPosts();

        // Subscribe to new posts
        const postsSubscription = supabase
            .channel('public:community_posts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, payload => {
                setPosts(prev => [payload.new, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(postsSubscription);
        };
    }, []);

    const fetchPosts = async () => {
        setIsLoadingPosts(true);
        const { data, error } = await supabase
            .from('community_posts')
            .select(`
                *,
                users (
                    name
                )
            `)
            .order('created_at', { ascending: false });

        if (data) setPosts(data);
        setIsLoadingPosts(false);
    };

    const handleMatch = () => {
        setMatching(true);
        setTimeout(() => {
            setMatchedMentor({
                name: "Priya",
                location: "Coimbatore, TN",
                role: "SaaS Founder & MSME Advisor",
                matchScore: 85,
                bio: "Helping women tech founders scale their operations in Tamil Nadu.",
                avatar: null
            });
            setMatching(false);
        }, 2000);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const { error } = await supabase
            .from('community_posts')
            .insert([
                {
                    user_id: user.id,
                    content: newMessage
                }
            ]);

        if (error) console.error("Error posting message:", error);
        setNewMessage("");
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <button
                onClick={onBack}
                className="text-muted-text hover:text-primary mb-6 flex items-center gap-2 group transition-colors"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
            </button>

            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-dark-text mb-2 font-serif">Community Hub</h2>
                    <p className="text-muted-text">Connect with mentors, join industry groups, and share your wins.</p>
                </div>
                <div className="flex -space-x-3 overflow-hidden p-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-neutral-bg bg-white/10"></div>
                    ))}
                    <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-neutral-bg bg-primary text-white text-[10px] font-bold">+241</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left: Mentor Match & Groups */}
                <div className="lg:col-span-3 space-y-8">

                    <AnimatePresence mode="wait">
                        {activeRoom ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass rounded-3xl bg-white/[0.03] shadow-xl border border-white/10 flex flex-col h-[600px]"
                            >
                                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-dark-text">{activeRoom.title}</h3>
                                            <p className="text-xs text-muted-text">2.4K members online</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveRoom(null)}
                                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-muted-text" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {isLoadingPosts ? (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                        </div>
                                    ) : posts.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-text">
                                            <MessageSquare size={48} className="mb-4 opacity-20" />
                                            <p className="text-sm">Start the conversation in {activeRoom.title}</p>
                                        </div>
                                    ) : (
                                        posts.map((post, i) => (
                                            <div key={post.id || i} className={`flex flex-col ${post.user_id === user?.id ? 'items-end' : 'items-start'}`}>
                                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${post.user_id === user?.id ? 'bg-primary text-white rounded-br-none' : 'bg-white/5 text-dark-text rounded-bl-none border border-white/5'}`}>
                                                    <p className="font-bold text-[10px] mb-1 opacity-80">{post.users?.name || 'User'}</p>
                                                    <p>{post.content}</p>
                                                </div>
                                                <span className="text-[10px] text-muted-text mt-1">{new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 flex gap-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message (Tamil / English)..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-primary/20 text-sm text-dark-text"
                                    />
                                    <button type="submit" className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                        <Send size={20} />
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <div className="space-y-8">
                                {/* AI Mentor Match Section */}
                                <section className="glass p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/10 overflow-hidden relative">
                                    <div className="relative z-10">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="max-w-md">
                                                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                                    <Zap className="text-secondary" /> AI Mentor Match
                                                </h3>
                                                <p className="text-muted-text mb-6">Our algorithm matches you with mentors based on your industry, location, and business stage.</p>
                                                {!matchedMentor && !matching && (
                                                    <button
                                                        onClick={handleMatch}
                                                        className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                                    >
                                                        Find My Match
                                                    </button>
                                                )}
                                            </div>

                                            {matching && (
                                                <div className="flex flex-col items-center gap-4 py-4 px-10">
                                                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                                    <p className="text-sm font-bold text-primary animate-pulse">Scanning Mentor Database...</p>
                                                </div>
                                            )}

                                            {matchedMentor && (
                                                <motion.div
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="bg-white/[0.03] p-6 rounded-2xl shadow-xl border border-white/10 flex items-center gap-4 max-w-sm"
                                                >
                                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                                                        {matchedMentor.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-dark-text">{matchedMentor.name}</h4>
                                                            <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded-full">{matchedMentor.matchScore}% Match</span>
                                                        </div>
                                                        <p className="text-xs text-muted-text flex items-center gap-1 mt-0.5">
                                                            <MapPin size={10} /> {matchedMentor.location}
                                                        </p>
                                                        <p className="text-xs font-bold text-primary mt-1">{matchedMentor.role}</p>
                                                    </div>
                                                    <button className="bg-primary text-white p-2 rounded-lg ml-2">
                                                        <MessageSquare size={16} />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
                                </section>

                                {/* Industry Rooms */}
                                <section>
                                    <h3 className="text-xl font-bold mb-4">Industry Chat Rooms</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <RoomCard
                                            title="Textiles & Handloom"
                                            members="1.2K"
                                            location="Erode / Coimbatore"
                                            onClick={() => setActiveRoom({ title: "Textiles & Handloom" })}
                                        />
                                        <RoomCard
                                            title="EdTech Founders"
                                            members="850"
                                            location="Chennai / Remote"
                                            onClick={() => setActiveRoom({ title: "EdTech Founders" })}
                                        />
                                        <RoomCard
                                            title="Agri-Business"
                                            members="2.4K"
                                            location="Trichy / Madurai"
                                            onClick={() => setActiveRoom({ title: "Agri-Business" })}
                                        />
                                        <RoomCard
                                            title="Food & Beverage"
                                            members="1.5K"
                                            location="Salem / TN"
                                            onClick={() => setActiveRoom({ title: "Food & Beverage" })}
                                        />
                                    </div>
                                </section>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Success Feed */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Success Feed</h3>
                            <button className="text-primary text-sm font-bold flex items-center gap-1">
                                View All Wins <ArrowRight size={14} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <SuccessCard
                                user="Anonymous Founder"
                                title="₹10L raised via our Pitch AI!"
                                time="2h ago"
                                content="Just closed my pre-seed round. EmpowerHer's deck generator made the difference!"
                            />
                            <SuccessCard
                                user="S. Meenakshi"
                                title="GST Filing completed in 2 mins"
                                time="5h ago"
                                content="The Tax Assistant flagged a 1% interest subvention I didn't know about. Saved ₹15K!"
                            />
                        </div>
                    </section>
                </div>

                {/* Right: Networking Stats & Events */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-6 rounded-3xl bg-white/[0.03] border border-white/10 shadow-sm">
                        <h3 className="font-bold mb-4">Your Network</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-2xl font-bold text-primary">24</p>
                                <p className="text-[10px] text-muted-text font-bold uppercase">Mentors</p>
                            </div>
                            <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-2xl font-bold text-accent">156</p>
                                <p className="text-[10px] text-muted-text font-bold uppercase">Peers</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl bg-white/[0.03] border border-white/10 shadow-xl shadow-black/30">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Video size={18} className="text-accent" /> Upcoming Mixers
                        </h3>
                        <div className="space-y-4">
                            <EventItem date="Feb 25" title="Virtual Co-Working" type="Co-Working" />
                            <EventItem date="Mar 02" title="TN Angel Network Demo" type="Pitch Event" />
                        </div>
                        <button className="w-full mt-6 bg-accent text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-accent/20">
                            Host a Mixer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RoomCard = ({ title, members, location, onClick }) => (
    <div
        onClick={onClick}
        className="glass p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/30 transition-all cursor-pointer group shadow-sm hover:shadow-md"
    >
        <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold">
                <Users size={20} />
            </div>
            <span className="text-[10px] font-bold text-muted-text">{members} active</span>
        </div>
        <h4 className="font-bold text-dark-text mb-1 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-[10px] text-muted-text flex items-center gap-1">
            <MapPin size={10} /> {location}
        </p>
    </div>
);

const SuccessCard = ({ user, title, time, content }) => (
    <div className="glass p-6 rounded-2xl bg-white/[0.03] border border-white/10 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent text-xs font-bold">
                    {user[0]}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-dark-text">{title}</h4>
                    <p className="text-[10px] text-muted-text">{user} • {time}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="text-muted-text hover:text-accent"><Heart size={16} /></button>
                <button className="text-muted-text hover:text-primary"><Share2 size={16} /></button>
            </div>
        </div>
        <p className="text-xs text-muted-text leading-relaxed italic border-l-2 border-accent/20 pl-4">
            "{content}"
        </p>
    </div>
);

const EventItem = ({ date, title, type }) => (
    <div className="flex gap-4 group cursor-pointer">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/10 group-hover:border-accent/30 transition-colors">
            <span className="text-[7px] font-bold text-accent uppercase">{date.split(' ')[0]}</span>
            <span className="text-sm font-bold text-dark-text">{date.split(' ')[1]}</span>
        </div>
        <div>
            <p className="text-sm font-bold text-dark-text opacity-90">{title}</p>
            <span className="text-[10px] text-muted-text">{type}</span>
        </div>
    </div>
);

export default Community;
