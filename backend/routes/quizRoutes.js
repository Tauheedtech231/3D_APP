// backend/routes/quizRoutes.js
import express from "express";
import { getQuizzes } from "../controllers/quizController.js";

const router = express.Router();

router.get("/", getQuizzes); // GET /api/quizzes

export default router;
