import prisma from '../lib/prisma.js';

export const scanReceipt = async (req, res) => {
    const { firebaseId, amount, category, title } = req.body;

    try {
        // In a real OCR flow, we'd use AWS Textract or similar here.
        // For the MVP, we assume the frontend sends extracted data or we mock it.
        const mockData = {
            title: title || "Store Receipt",
            amount: amount || (Math.random() * 500 + 100).toFixed(2),
            category: category || "Business",
            gstAmount: ((amount || 100) * 0.18).toFixed(2),
        };

        if (firebaseId) {
            const user = await prisma.user.findUnique({ where: { firebaseId } });
            if (user) {
                const expense = await prisma.expense.create({
                    data: {
                        userId: user.id,
                        title: mockData.title,
                        amount: parseFloat(mockData.amount),
                        category: mockData.category,
                        gstAmount: parseFloat(mockData.gstAmount),
                        status: "Verified"
                    }
                });
                return res.json(expense);
            }
        }

        res.json(mockData);
    } catch (error) {
        console.error("OCR Scan Error:", error);
        res.status(500).json({ error: "Failed to process receipt" });
    }
};
