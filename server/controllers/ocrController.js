import { supabaseAdmin } from '../lib/supabaseAdmin.js';

export const scanReceipt = async (req, res) => {
    const { userId, amount, category, title } = req.body;

    try {
        const mockData = {
            title: title || "Store Receipt",
            amount: amount || (Math.random() * 500 + 100).toFixed(2),
            category: category || "Business",
            gstAmount: ((amount || 100) * 0.18).toFixed(2),
        };

        if (userId) {
            const { data: expense, error } = await supabaseAdmin
                .from('expenses')
                .insert([
                    {
                        user_id: userId,
                        title: mockData.title,
                        amount: parseFloat(mockData.amount),
                        category: mockData.category,
                        gst_amount: parseFloat(mockData.gstAmount),
                        status: "Verified"
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            return res.json(expense);
        }

        res.json(mockData);
    } catch (error) {
        console.error("OCR Scan Error:", error);
        res.status(500).json({ error: "Failed to process receipt" });
    }
};
