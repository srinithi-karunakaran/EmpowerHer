import prisma from '../lib/prisma.js';

export const getUserProfile = async (req, res) => {
    const { firebaseId } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { firebaseId },
            include: {
                pitches: true,
                expenses: true,
                mentors: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

export const createUser = async (req, res) => {
    const { firebaseId, email, name, industry } = req.body;

    try {
        const user = await prisma.user.create({
            data: {
                firebaseId,
                email,
                name,
                industry,
                growthScore: 0
            }
        });
        res.status(201).json(user);
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
};

export const updateProfile = async (req, res) => {
    const { firebaseId } = req.params;
    const data = req.body;

    try {
        const user = await prisma.user.update({
            where: { firebaseId },
            data
        });
        res.json(user);
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};
