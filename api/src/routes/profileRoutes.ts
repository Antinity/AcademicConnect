import express from "express";
import Profile from "../models/Profile.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all profiles (usually we might just want teachers)
router.get("/", async (req, res) => {
  try {
    const { role } = req.query;
    
    // We can populate the user info to get the name and role
    // Or filter directly. Here we populate User to check role if provided.
    // For simplicity, we'll fetch all profiles and populate user data
    let profiles = await Profile.find().populate("userId", "name role email");
    
    // Filter out if user wants specific role profiles
    if (role) {
      profiles = profiles.filter((p: any) => p.userId && p.userId.role === role);
    }

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get profile by userId
router.get("/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate("userId", "name role email");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create or update profile
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).user;
    const updateData = req.body;

    // Update user's name if provided
    if (updateData.name) {
      const User = (await import("../models/User.js")).default;
      await User.findByIdAndUpdate(userId, { name: updateData.name });
    }

    let profile = await Profile.findOne({ userId });
    
    if (profile) {
      profile = await Profile.findOneAndUpdate({ userId }, updateData, { new: true });
    } else {
      profile = new Profile({ ...updateData, userId });
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
