const express = require("express");
const router = express.Router();
const Email = require("../models/Email");

// GET /api/emails/subjects
router.get("/subjects", async (req, res) => {
  try {
const subjects = await Email.find({}).sort({ date: -1 });
    res.json(subjects);
  } catch (err) {
    console.error("❌ Error fetching subjects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
