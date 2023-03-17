const express = require("express");
const router = express.Router();

// Features
const mailer = require("../controllers/services/maling");
const pagination = require("../middleware/pagination");

// Import Pages
const {
	homePage,
	blogsPage,
	portfolioPage,
	electPage,
	publishPage,
} = require("../controllers/root");

// Import Routes
const adminRouter = require("./admin");
const composeRouter = require("./compose");
const searchRouter = require("./ajaxSearch");
const PostsBlogsRouter = require("./posts");
const PortBlogsRouter = require("./port");
const AboutRouter = require("./about");

// Pages
router.get("/", homePage);
router.get("/blogs", pagination, blogsPage); // pagination middleware
router.get("/portfolio", portfolioPage);
router.get("/elect", electPage);
router.get("/publish", publishPage);

// Service
router.post("/publish", mailer);

// Other Routes
router.use("", searchRouter);
router.use("/admin", adminRouter);
router.use("/compose", composeRouter);
router.use("/port", PortBlogsRouter);
router.use("/posts", PostsBlogsRouter);
router.use("/about", AboutRouter);

module.exports = router;
