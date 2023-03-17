const Port = require("../model/Port");
const Post = require("../model/Post");

const pagination = async (req, res, next) => {
	let resultsPerPage = 8;
	const noOfDBs = 2;
	const resultsPerDB = Math.floor(resultsPerPage / noOfDBs);
	resultsPerPage =
		resultsPerDB * noOfDBs === resultsPerPage
			? resultsPerPage
			: resultsPerDB * noOfDBs;

	try {
		const posts = await Post.countDocuments({});
		const ports = await Port.countDocuments({});

		const totalResults = posts + ports;
		const numberOfPages = Math.ceil(totalResults / resultsPerPage);

		let page = req.query.page ? Number(req.query.page) : 1;
		if (page > numberOfPages) {
			res.redirect(`/blogs?page=${encodeURIComponent(numberOfPages)}`);
		} else if (page < 1) {
			res.redirect(`/blogs?page=${encodeURIComponent("1")}`);
		}

		//Determine the LIMIT to get relevant number of posts
		const startingLimit = (page - 1) * resultsPerDB;
		const endingLimit = startingLimit + resultsPerDB;

		const paginatedposts = await Post.find({})
			.sort({ _id: -1 })
			.skip(startingLimit)
			.limit(resultsPerDB);
		const paginatedports = await Port.find({})
			.sort({ _id: -1 })
			.skip(startingLimit)
			.limit(resultsPerDB);

		let iterator = page - 2 < 1 ? 1 : page - 2;
		let endingLink =
			iterator + 4 <= numberOfPages
				? iterator + 4
				: page + (numberOfPages - page);
		if (endingLink < page + 1) {
			iterator -= page + 1 - numberOfPages;
		}

		req.posts = paginatedposts;
		req.ports = paginatedports;
		req.page = page;
		req.iterator = iterator;
		req.endingLink = endingLink;
		req.numberOfPages = numberOfPages;

		next();
	} catch (error) {
		console.log(error);
	}
};

module.exports = pagination;
