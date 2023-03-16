const express = require("express");
const router = express.Router();

const { postBlogs } = require("../controllers/postBlogs");

router.get("/:postId", postBlogs);

module.exports = router;
