const express = require("express");
const router = express.Router();

const { portBlogs, resumePage } = require("../controllers/portBlogs");

router.get("/resume.json", resumePage);
router.get("/:portId", portBlogs);

module.exports = router;
