const mongoose = require("mongoose");

const portSchema = new mongoose.Schema({
	title: String,
	content: String,
	year: Number,
	imgSrc: String,
	topContent: String,
});
module.exports = mongoose.model("Port", portSchema);
