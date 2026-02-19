import { supabaseAdmin } from '../lib/supabaseAdmin.js';

export const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

export const createUser = async (req, res) => {
    const { userId, email, name, industry } = req.body;

    try {
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .insert([
                {
                    id: userId,
                    email,
                    name,
                    industry
                }
            ])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(user);
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
};

export const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const data = req.body;

    try {
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .update(data)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        res.json(user);
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};
