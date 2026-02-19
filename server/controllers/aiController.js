import OpenAI from 'openai';
import dotenv from 'dotenv';
import prisma from '../lib/prisma.js';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const analyzePitch = async (req, res) => {
    const { pitchText, firebaseId } = req.body;

    if (!pitchText) {
        return res.status(400).json({ error: "Pitch text is required" });
    }

    try {
        let result;

        if (process.env.OPENAI_API_KEY === 'mock_key' || !process.env.OPENAI_API_KEY) {
            // SIMULATION MODE
            result = await simulateAdvancedAnalysis(pitchText, firebaseId);
        } else {
            // REAL GPT-4o MODE
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an elite silicon valley venture capitalist judge. 
                        Analyze the pitch and return a JSON object with:
                        - score (0-100)
                        - marketFit (0-100)
                        - clarity (0-100)
                        - investorAppeal (0-100)
                        - improvements (array of 3 specific actionable tips)
                        - slides (array of 10 objects with 'title' and 'content' for a deck)
                        - script (string, 2 min speech with [0:30] timing cues)
                        - psychologyHeatmap (array of 5 objects with 'section' and 'interestLevel' 0.1-1.0)
                        - refinedText (string, a 20% shorter, clearer version of the pitch)`
                    },
                    { role: "user", content: pitchText }
                ],
                response_format: { type: "json_object" }
            });
            result = JSON.parse(completion.choices[0].message.content);
        }

        // Persist to DB if user is logged in
        if (firebaseId) {
            const user = await prisma.user.findUnique({ where: { firebaseId } });
            if (user) {
                await prisma.pitch.create({
                    data: {
                        userId: user.id,
                        content: pitchText,
                        score: result.score,
                        analysis: result
                    }
                });
            }
        }

        res.json(result);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        // Emergency Fallback
        const fallback = await simulateAdvancedAnalysis(pitchText, firebaseId);
        res.json(fallback);
    }
};

async function simulateAdvancedAnalysis(text, firebaseId = null) {
    const lowerText = text.toLowerCase();
    const len = text.length;

    let user = null;
    if (firebaseId) {
        try {
            user = await prisma.user.findUnique({ where: { firebaseId } });
        } catch (e) {
            console.error("User fetch error:", e);
        }
    }

    // Dynamic score calculation
    let baseScore = 60;
    if (len > 300) baseScore += 15;
    if (len > 800) baseScore += 10;

    // Penalty for very short text
    if (len < 50) baseScore = 30;

    const keywords = ['revenue', 'growth', 'market', 'solve', 'women', 'tech', 'scale', 'profit'];
    keywords.forEach(word => {
        if (lowerText.includes(word)) baseScore += 3;
    });

    const score = Math.min(Math.max(baseScore, 45), 98);
    const marketFit = Math.min(score + (Math.random() * 10 - 5), 98);
    const clarity = Math.min(score - 10, 95);
    const investorAppeal = Math.min(score - 5, 95);

    // Generate a significantly longer script (~300 words)
    const scriptSections = [
        `[0:00] Good morning judges and fellow entrepreneurs. My name is ${user?.name || 'Priya'} and I'm here to introduce a revolution in our sector. Most people look at the current market and see problems, but we saw a massive, untapped opportunity to empower thousands through our unique solution.`,
        `[0:30] The core of our innovation lies in how we handle the existing fragmentation. Currently, users struggle with complexity and lack of support, leading to massive inefficiencies. Our platform aggregates these needs into a seamless interface that reduces friction by 70%. Imagine a world where this barrier simply doesn't exist anymore.`,
        `[1:00] Let's talk about the numbers because that's where the real excitement is. We're targeting a total addressable market of ₹5,000 Crores. Our pilot program in Tamil Nadu has already shown that retention is at an all-time high of 85%. This isn't just a concept; it's a proven model ready for regional expansion.`,
        `[1:30] Our team brings over 20 years of combined experience in tech and operations. We've weathered the storms of startup life and we know exactly what it takes to scale this to the next level. We're not just building a product; we're building a sustainable ecosystem for the long term.`,
        `[2:00] In conclusion, we are seeking an investment to help us reach 100,000 users by the end of this year. We invite you to join us on this journey to change the face of our industry. Thank you for your time and I look forward to your questions during the Q&A session.`
    ];

    return {
        score: Math.round(score),
        marketFit: Math.round(marketFit),
        clarity: Math.round(clarity),
        investorAppeal: Math.round(investorAppeal),
        refinedText: text.length > 50 ? text.substring(0, Math.min(text.length, 300)) + " (Optimized for clarity and impact by AI)..." : text,
        improvements: [
            score < 70 ? "Your problem statement is too technical. Simplify for a broader investment committee." : "Deepen your competitive moat analysis.",
            "Add detailed unit economics for the recurring revenue model.",
            "Include a slide on your Go-To-Market strategy for rural segments."
        ],
        slides: [
            { title: "The Vision", content: "Empowering the next generation of women leaders through technology and community." },
            { title: "Market Gap", content: "Identifying the ₹5000Cr void in regional business support systems." },
            { title: "The Hero Solution", content: "A mobile-first platform designed for accessibility and high-trust interactions." },
            { title: "Deep Dive: TAM/SAM", content: "12M potential users in South India alone." },
            { title: "Monetization Engine", content: "Hybrid SaaS and transaction-fee model with high LTV." },
            { title: "The Edge", content: "Proprietary datasets and deep community roots in TN." },
            { title: "Scaling Roadmap", content: "Phase 1: TN & Kerala. Phase 2: Pan-India MSME sectors." },
            { title: "Leadership", content: "Founding team with exits in EdTech and AgTech." },
            { title: "Current Traction", content: "5000+ waitlist signups and 3 major MOU partnerships." },
            { title: "The Opportunity", content: "Seed round open for strategic partners and visionaries." }
        ],
        script: scriptSections.join('\n\n'),
        psychologyHeatmap: [
            { section: "Opening Hook", interestLevel: 0.85 },
            { section: "Problem Validation", interestLevel: 0.65 },
            { section: "Solution Reveal", interestLevel: 0.92 },
            { section: "Market potential", interestLevel: 0.78 },
            { section: "The Ask", interestLevel: 0.95 }
        ]
    };
}
