const Port = require("../model/Port");
const Post = require("../model/Post");

const compose = async (req, res) => {
	res.render("compose", { user: req.user });
};

const composePort = async (req, res) => {
	const { title, content, year, imgSrc, topContent } = req.body;

	const port = new Port({
		title,
		content,
		year: year ? year : 2018,
		imgSrc,
		topContent,
	});
	try {
		const saved = await port.save();
		if (saved) {
			console.log("success");
			res.send(req.user);
		}
	} catch (error) {
		console.log(error);
		res.send(error);
	}
};

const composeBlogs = async (req, res) => {
	const { title, content, img } = req.body;
	const post = new Post({
		title,
		content,
		img,
	});
	try {
		const saved = await post.save();
		if (saved) {
			console.log("sucess");
			res.send(req.user);
		}
	} catch (error) {
		console.log(error);
		res.send(error);
	}
};

module.exports = { compose, composePort, composeBlogs };
