const Port = require("../model/Port");
const Post = require("../model/Post");

const homePage = async (req, res) => {
	try {
		const { posts, ports, page, iterator, endingLink, numberOfPages } = req;
		const top5 = await Post.find({}).sort({ _id: -1 }).limit(5);
		const bottom5 = await Port.find({}).sort({ _id: -1 }).limit(5);
		res.render("home", {
			top5,
			bottom5,
			posts,
			ports,
			page,
			iterator,
			endingLink,
			numberOfPages,
		});
	} catch (error) {
		console.log(error);
	}
};

const blogsPage = async (req, res) => {
	try {
		const { posts, ports, page, iterator, endingLink, numberOfPages } = req;
		res.render("blogs", {
			posts,
			ports,
			page,
			iterator,
			endingLink,
			numberOfPages,
		});
	} catch (error) {
		console.log(error);
	}
};

const portfolioPage = async (req, res) => {
	port2023 = await Port.find({ year: 2023 });
	port2022 = await Port.find({ year: 2022 });
	port2021 = await Port.find({ year: 2021 });
	port2020 = await Port.find({ year: 2020 });
	port2019 = await Port.find({ year: 2019 });

	res.render("port", { port2023, port2022, port2021, port2020, port2019 });
};

const contributePage = function (req, res) {
	res.render("contribute");
};

const publishPage = function (req, res) {
	res.render("publish");
};

module.exports = {
	homePage,
	blogsPage,
	portfolioPage,
	contributePage,
	publishPage,
};
