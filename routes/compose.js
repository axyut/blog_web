const express = require("express");
const router = express.Router();
const jwt_checker = require("../middleware/jwt-checker");

const {
	compose,
	composePort,
	composeBlogs,
} = require("../controllers/compose");

// Upload to database
router.get("/", compose);
router.post("/port", jwt_checker, composePort);
router.post("/blogs", jwt_checker, composeBlogs);

module.exports = router;
