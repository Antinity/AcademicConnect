import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all conversations for the logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).user;
    const conversations = await Conversation.find({ participantIds: userId }).populate("participantIds", "name role");
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create a new conversation (or return existing one if between same participants)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).user;
    const { targetUserId } = req.body;

    let conversation = await Conversation.findOne({
      participantIds: { $all: [userId, targetUserId], $size: 2 }
    });

    if (!conversation) {
      conversation = new Conversation({
        participantIds: [userId, targetUserId]
      });
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get messages for a specific conversation
router.get("/:id/messages", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id as string }).sort("timestamp");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Send a message
router.post("/:id/messages", authMiddleware, async (req, res) => {
  try {
    const { userId } = (req as any).user;
    const { text } = req.body;
    const conversationId = req.params.id as string;

    // Verify conversation exists and user is part of it
    const conversation = await Conversation.findOne({ _id: conversationId, participantIds: userId });
    if (!conversation) {
      return res.status(403).json({ message: "Not authorized to send messages to this conversation" });
    }

    const message = new Message({
      conversationId,
      senderId: userId,
      text
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
