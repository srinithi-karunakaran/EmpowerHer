import React, { useState } from 'react';
import { Scale, Receipt, FilePlus2, Landmark, Calendar, AlertTriangle, CheckCircle2, Search, ArrowRight, FileText, HelpCircle, Upload, AlertCircle, Trash2, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scanReceiptApi } from '../utils/api';
import { useAuth } from '../utils/AuthContext';

const LegalTax = ({ onBack }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('expenses');
    const [scanning, setScanning] = useState(false);
    const [expenses, setExpenses] = useState([
        { id: '1', title: 'Handloom Silk Yarn', amount: 12400.00, category: 'Inventory', status: 'Verified', date: 'Feb 15, 2024' },
        { id: '2', title: 'Facebook Ads', amount: 2500.00, category: 'Marketing', status: 'Pending', date: 'Feb 14, 2024' },
        { id: '3', title: 'Office Supplies', amount: 850.00, category: 'Admin', status: 'Verified', date: 'Feb 12, 2024' },
    ]);

    const handleScan = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setScanning(true);
        try {
            const formData = new FormData();
            formData.append('receipt', file);
            formData.append('firebaseId', user?.firebaseId || user?.uid);

            const result = await scanReceiptApi(formData);

            const newExpense = {
                id: result.id || Date.now().toString(),
                title: result.title,
                amount: result.amount,
                category: result.category,
                status: result.status || 'Verified',
                date: result.date ? new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'
            };

            setExpenses(prev => [newExpense, ...prev]);
        } catch (err) {
            console.error(err);
            alert("Scan failed. Using fallback data for demo.");
            setExpenses(prev => [{
                id: Date.now().toString(),
                title: "Mock Invoice",
                amount: 4500.00,
                category: "Inventory",
                status: "Verified",
                date: "Today"
            }, ...prev]);
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <button
                onClick={onBack}
                className="text-muted-text hover:text-primary mb-6 flex items-center gap-2 group transition-colors"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-dark-text mb-2 font-serif text-white">Legal & Tax Assistant</h2>
                    <p className="text-muted-text">Manage your GST compliance, MSME benefits, and business documents.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-2xl w-full md:w-auto border border-white/10">
                    <button
                        onClick={() => setActiveTab('expenses')}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'expenses' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-text hover:text-primary'}`}
                    >
                        Expenses
                    </button>
                    <button
                        onClick={() => setActiveTab('invoices')}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'invoices' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-text hover:text-primary'}`}
                    >
                        Invoices
                    </button>
                    <button
                        onClick={() => setActiveTab('benefits')}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'benefits' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-text hover:text-primary'}`}
                    >
                        Benefits
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'expenses' && <ExpenseTracker handleScan={handleScan} expenses={expenses} scanning={scanning} />}
                    {activeTab === 'invoices' && <InvoiceGenerator />}
                    {activeTab === 'benefits' && <BenefitsTracker />}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-6 rounded-3xl bg-white/[0.03] shadow-xl border border-white/10 shadow-black/50">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-primary" /> Tax Calendar
                        </h3>
                        <div className="space-y-4">
                            <CalendarItem date="Feb 22" title="GST Return Filing" status="bg-warning" statusText="Due in 3 days" />
                            <CalendarItem date="Mar 15" title="Advance Tax (4th Installment)" status="bg-white/5" statusText="Upcoming" />
                            <CalendarItem date="Mar 31" title="Financial Year End" status="bg-white/5" statusText="Critical" />
                        </div>
                        <button className="w-full mt-6 bg-primary/20 text-primary py-3 rounded-2xl font-bold text-sm hover:bg-primary/30 transition-all border border-primary/20">
                            Auto-file GST Return
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ExpenseTracker = ({ handleScan, expenses, scanning }) => (
    <div className="space-y-6">
        <div className="glass p-8 rounded-3xl bg-white/[0.03] shadow-xl border border-white/10 flex flex-col items-center justify-center text-center border-dashed border-2 shadow-black/50">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Receipt size={32} className={scanning ? 'animate-bounce' : ''} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{scanning ? 'Analyzing Receipt...' : 'Scan Receipts (OCR)'}</h3>
            <p className="text-muted-text text-sm max-w-sm mb-6">Take a photo of your business receipts. Our AI will automatically categorize them for GST compliance.</p>
            <div className="relative">
                <input
                    type="file"
                    onChange={handleScan}
                    disabled={scanning}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    accept="image/*"
                />
                <button className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50">
                    {scanning ? 'Processing...' : 'Upload Receipt'}
                </button>
            </div>
        </div>

        <div className="glass p-6 rounded-3xl bg-white/[0.03] shadow-sm border border-white/5">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-dark-text opacity-90">Recent Transactions</h3>
                <button className="text-primary text-xs font-bold flex items-center gap-1 group">
                    View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            <div className="space-y-4">
                {expenses.map(expense => (
                    <TransactionItem
                        key={expense.id}
                        title={expense.title}
                        category={expense.category}
                        amount={`₹${expense.amount}`}
                        date={expense.date}
                        status={expense.status}
                    />
                ))}
            </div>
        </div>
    </div>
);

const InvoiceGenerator = () => (
    <div className="glass p-8 rounded-3xl bg-white/[0.03] shadow-xl border border-white/10 shadow-black/50">
        <div className="flex justify-between items-start mb-8">
            <div>
                <h3 className="text-xl font-bold">Smart Invoicing</h3>
                <p className="text-sm text-muted-text">Create GST-compliant invoices with automated GST calculations.</p>
            </div>
            <button className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20">
                <Plus />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-muted-text uppercase mb-1">Total Receivables</p>
                <p className="text-2xl font-bold text-dark-text">₹1,45,000</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-muted-text uppercase mb-1">Overdue</p>
                <p className="text-2xl font-bold text-accent">₹12,500</p>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-white/5 rounded-2xl bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-muted-text font-bold">C</div>
                    <div>
                        <p className="font-bold">Coimbatore Textiles Ltd.</p>
                        <p className="text-xs text-muted-text opacity-70">Inv #HER-2024-001 • 19 Feb</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold">₹85,000</p>
                    <p className="text-[10px] text-success font-bold uppercase">Paid & Verified</p>
                </div>
            </div>
        </div>
    </div>
);

const BenefitsTracker = () => (
    <div className="space-y-6">
        <div className="glass p-8 rounded-3xl bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-4 mb-6">
                <Landmark className="text-primary" size={32} />
                <div>
                    <h3 className="text-xl font-bold text-white">Women-Led Benefits</h3>
                    <p className="text-sm text-muted-text opacity-80">Government schemes you're eligible for in Tamil Nadu.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BenefitCard
                    title="TN MSME Interest Subvention"
                    benefit="1% Interest Rate Cut"
                    desc="Applicable for term loans via TIIC for women entrepreneurs."
                    action="Apply Now"
                />
                <BenefitCard
                    title="Section 44AD Benefits"
                    benefit="Tax Reduction"
                    desc="Claim lower presumptive income tax if revenue < ₹2 Cr."
                    action="Learn More"
                />
            </div>
        </div>
    </div>
);

const CalendarItem = ({ date, title, status, statusText }) => (
    <div className="flex gap-4 group cursor-pointer">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
            <span className="text-[8px] font-bold text-primary uppercase">{date.split(' ')[0]}</span>
            <span className="text-lg font-bold text-dark-text">{date.split(' ')[1]}</span>
        </div>
        <div className="flex-1">
            <p className="text-sm font-bold text-dark-text opacity-90">{title}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${status}`}></div>
                <span className="text-[10px] font-bold text-muted-text capitalize">{statusText}</span>
            </div>
        </div>
    </div>
);

const TransactionItem = ({ title, category, amount, date, status }) => (
    <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-2xl transition-colors">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-muted-text opacity-50">
                <Receipt size={18} />
            </div>
            <div>
                <p className="text-sm font-bold text-dark-text">{title}</p>
                <p className="text-[10px] text-muted-text font-medium">{category} • {date}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-sm font-bold text-dark-text">{amount}</p>
            <p className={`text-[9px] font-bold uppercase ${status === 'Verified' ? 'text-success' : 'text-warning'}`}>{status}</p>
        </div>
    </div>
);

const BenefitCard = ({ title, benefit, desc, action }) => (
    <div className="bg-white/[0.03] p-5 rounded-2xl shadow-sm border border-white/5 hover:shadow-md transition-shadow">
        <div className="bg-success/10 text-success text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-3">
            {benefit}
        </div>
        <h4 className="font-bold text-dark-text mb-1">{title}</h4>
        <p className="text-xs text-muted-text mb-4 leading-relaxed opacity-70">{desc}</p>
        <button className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
            {action} <ArrowRight size={14} />
        </button>
    </div>
);

export default LegalTax;
