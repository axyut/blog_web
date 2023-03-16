const express = require("express");
const router = express.Router();

const {
	homePage,
	blogsPage,
	portfolioPage,
	mailer,
	electPage,
	publishPage,
} = require("../controllers/root");

router.get("/", homePage);
router.get("/blogs", blogsPage);
router.get("/portfolio", portfolioPage);
router.get("/elect", electPage);
router.get("/publish", publishPage);

router.post("/publish", mailer);

module.exports = router;
