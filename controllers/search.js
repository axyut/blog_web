const Post = require("../model/Post");

const search = async (req, res) => {
	let payload = req.body.payload.trim();
	try {
		let search = await Post.find({
			title: { $regex: new RegExp(payload + ".*", "i") },
		}).exec();
		//Limit our search result to 10
		search = search.slice(0, 10);
		res.send({ payload: search });
	} catch (error) {
		console.log(error);
	}
};

module.exports = { search };
