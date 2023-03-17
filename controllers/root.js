const Port = require("../model/Port");
const Post = require("../model/Post");

const homePage = async (req, res) => {
	const top5 = await Post.find({}).sort({ _id: -1 }).limit(5);
	const bottom5 = await Port.find({}).sort({ _id: -1 }).limit(5);
	res.render("home", {
		posts: top5,
		ports: bottom5,
	});
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

const electPage = function (req, res) {
	res.render("elect");
};

const publishPage = function (req, res) {
	res.render("publish");
};

module.exports = {
	homePage,
	blogsPage,
	portfolioPage,
	electPage,
	publishPage,
};
