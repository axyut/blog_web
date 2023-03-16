const Post = require("../model/Post");

const postBlogs = async (req, res) => {
	const requestedPostId = req.params.postId;
	try {
		const post = await Post.findOne({ _id: requestedPostId });
		res.render("postDisplay", {
			title: post.title,
			img: post.img,
			content: post.content,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = { postBlogs };
