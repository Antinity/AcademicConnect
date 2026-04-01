import express from "express";
import Review from "../models/Review.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
const router = express.Router();
// Get reviews for a specific teacher
router.get("/:teacherId", async (req, res) => {
    try {
        const reviews = await Review.find({ teacherId: req.params.teacherId }).sort({ date: -1 });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Add a review for a teacher
router.post("/:teacherId", authMiddleware, async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { rating, comment } = req.body;
        const { userId } = req.user;
        // Get the reviewer's name
        const reviewerUser = await User.findById(userId);
        if (!reviewerUser) {
            return res.status(404).json({ message: "Reviewer not found" });
        }
        const review = new Review({
            teacherId,
            reviewer: reviewerUser.name,
            rating,
            comment,
            date: new Date().toISOString()
        });
        await review.save();
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
export default router;
//# sourceMappingURL=reviewRoutes.js.map