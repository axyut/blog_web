const express = require("express");
const router = express.Router();

const { privacy, terms, website } = require("../controllers/about");

router.get("/privacy", privacy);
router.get("/terms", terms);
router.get("/website", website);

module.exports = router;
