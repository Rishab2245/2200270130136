import express from "express";
import { createShortUrl, redirectToUrl, getUrlStats } from "../controllers/indexController.js";

const router = express.Router();
// Create short URL
router.post("/shorturls", createShortUrl);

// Get URL statistics
router.get("/shorturls/:shortCode", getUrlStats);

// Redirect to original URL
router.get("/:shortCode", redirectToUrl);

export default router;
