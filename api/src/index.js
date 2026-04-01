import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
// Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/conversations", messageRoutes);
app.get("/", (req, res) => {
    res.send("AcademicConnect API is running!");
});
mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/academic-connect")
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Server is running on port ${port}`));
})
    .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});
//# sourceMappingURL=index.js.map