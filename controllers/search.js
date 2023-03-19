const Post = require("../model/Post");
const Port = require("../model/Port");

const search = async (req, res) => {
	let payload = req.body.payload.trim();
	try {
		let searchPost = await Post.find({
			title: { $regex: new RegExp(payload + ".*", "i") },
		})
			.limit(5)
			.select({ title: 1 })
			.exec();
		let searchPort = await Port.find({
			title: { $regex: new RegExp(payload + ".*", "i") },
		})
			.limit(5)
			.select({ title: 1 })
			.exec();

		res.send({ searchPort, searchPost });
	} catch (error) {
		console.log(error);
	}
};

module.exports = { search };
