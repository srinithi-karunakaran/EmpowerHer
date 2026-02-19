import OpenAI from 'openai';
import dotenv from 'dotenv';
import { supabaseAdmin } from '../lib/supabaseAdmin.js';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const analyzePitch = async (req, res) => {
    const { pitchText, userId } = req.body;

    if (!pitchText) {
        return res.status(400).json({ error: "Pitch text is required" });
    }

    try {
        let result;

        if (process.env.OPENAI_API_KEY === 'mock_key' || !process.env.OPENAI_API_KEY) {
            // SIMULATION MODE
            result = await simulateAdvancedAnalysis(pitchText, userId);
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
        if (userId) {
            const { error: dbError } = await supabaseAdmin
                .from('ai_conversations')
                .insert([
                    {
                        user_id: userId,
                        question: pitchText,
                        answer: JSON.stringify(result)
                    }
                ]);
            if (dbError) console.error("Error saving conversation:", dbError);
        }

        res.json(result);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        // Emergency Fallback
        const fallback = await simulateAdvancedAnalysis(pitchText, userId);
        res.json(fallback);
    }
};

async function simulateAdvancedAnalysis(text, userId = null) {
    const lowerText = text.toLowerCase();
    const len = text.length;

    let user = null;
    if (userId) {
        try {
            const { data } = await supabaseAdmin
                .from('users')
                .select('name')
                .eq('id', userId)
                .single();
            user = data;
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

    // Generate a script
    const scriptSections = [
        `[0:00] Good morning judges. My name is ${user?.name || 'Priya'} and I'm here to introduce a revolution...`,
        `[0:30] The core of our innovation lies in how we handle the existing fragmentation...`,
        `[1:00] We're targeting a total addressable market of ₹5,000 Crores...`,
        `[1:30] Our team brings over 20 years of combined experience...`,
        `[2:00] In conclusion, we are seeking an investment to help us reach 100,000 users...`
    ];

    return {
        score: Math.round(score),
        marketFit: Math.round(marketFit),
        clarity: Math.round(clarity),
        investorAppeal: Math.round(investorAppeal),
        refinedText: text.length > 50 ? text.substring(0, Math.min(text.length, 300)) + "..." : text,
        improvements: [
            score < 70 ? "Your problem statement is too technical." : "Deepen your competitive moat analysis.",
            "Add detailed unit economics.",
            "Include a slide on GTM strategy."
        ],
        slides: [
            { title: "The Vision", content: "Empowering the next generation..." },
            { title: "Market Gap", content: "Identifying the ₹5000Cr void..." }
        ],
        script: scriptSections.join('\n\n'),
        psychologyHeatmap: [
            { section: "Opening Hook", interestLevel: 0.85 },
            { section: "Solution Reveal", interestLevel: 0.92 }
        ]
    };
}
