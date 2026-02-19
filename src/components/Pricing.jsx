const Pricing = ({ onBack }) => {
    const handleAction = (plan) => {
        if (plan === "Enterprise") {
            alert("Opening contact form for Enterprise inquiry...");
        } else {
            alert(`Setting up your ${plan} workspace. Welcome aboard!`);
        }
    };

    const plans = [
        {
            name: "Free",
            price: "₹0",
            desc: "For aspiring entrepreneurs exploring ideas.",
            features: ["1 Pitch AI Analysis", "Basic Expense Tracking", "Community Chat Access"],
            cta: "Join Now",
            color: "gray"
        },
        {
            name: "Pro",
            price: "₹499/mo",
            desc: "For active sellers scaling their business.",
            features: ["Unlimited Pitch AI", "Full GST & Tax Suite", "Mentor Matching", "Growth Optimizer"],
            cta: "Go Pro",
            highlight: true,
            color: "primary"
        },
        {
            name: "Enterprise",
            price: "Custom",
            desc: "For NGO partners and large cooperatives.",
            features: ["Bulk Team Management", "Regional MSME API Access", "Dedicated Support Manager"],
            cta: "Contact Us",
            color: "dark"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto py-8">
            <button
                onClick={onBack}
                className="text-muted-text hover:text-primary mb-12 flex items-center gap-2 group transition-colors"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
            </button>

            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-dark-text mb-4 font-serif text-white">Power Up Your Entrepreneurial Journey</h2>
                <p className="text-muted-text max-w-2xl mx-auto">Choose a plan that fits your current business stage. Upgrade or downgrade at any time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`glass p-8 rounded-3xl relative flex flex-col ${plan.highlight ? 'bg-white/[0.05] shadow-2xl border-2 border-primary ring-8 ring-primary/10 z-10' : 'bg-white/[0.03] border border-white/5 hover:shadow-xl transition-all'}`}
                    >
                        {plan.highlight && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Most Popular</span>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-dark-text mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold text-dark-text">{plan.price}</span>
                                {plan.price !== "Custom" && <span className="text-muted-text text-sm">/month</span>}
                            </div>
                            <p className="text-xs text-muted-text leading-relaxed">{plan.desc}</p>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            {plan.features.map((feature, j) => (
                                <div key={j} className="flex items-start gap-3">
                                    <div className={`mt-1 p-0.5 rounded-full ${plan.highlight ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-text'}`}>
                                        <Check size={12} />
                                    </div>
                                    <span className="text-sm text-dark-text opacity-80">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handleAction(plan.name)}
                            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${plan.highlight ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02]' : 'bg-white/5 text-muted-text hover:bg-white/10'}`}
                        >
                            {plan.cta}
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="mt-16 text-center grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                    <Shield className="text-success mb-2" />
                    <p className="text-sm font-bold">Secure SSL Payments</p>
                </div>
                <div className="flex flex-col items-center">
                    <Star className="text-secondary mb-2" />
                    <p className="text-sm font-bold">30-Day Money Back</p>
                </div>
                <div className="flex flex-col items-center">
                    <Zap className="text-accent mb-2" />
                    <p className="text-sm font-bold">Instant Activation</p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
