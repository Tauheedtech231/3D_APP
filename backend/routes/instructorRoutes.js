import express from "express";
import { getInstructors } from "../controllers/instructorController.js";

const router = express.Router();

router.get("/", getInstructors);

export default router;
