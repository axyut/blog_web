const express = require("express");
const router = express.Router();

const { search } = require("../controllers/search");

router.post("/getPosts", search);

module.exports = router;
