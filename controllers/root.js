const Port = require("../model/Port");
const Post = require("../model/Post");

// Mailing Dependencies
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// Secrets
const Redirect_URL = process.env.REDIRECT_URL;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
// CHANGE EVERY WEEK
const refreshToken = process.env.REFRESH_TOKEN;

const OAuth2Client = new google.auth.OAuth2(
	clientId,
	clientSecret,
	Redirect_URL
);
OAuth2Client.setCredentials({ refresh_token: refreshToken });

const homePage = async (req, res) => {
	const top5 = await Post.find({}).sort({ _id: -1 }).limit(5);
	const bottom5 = await Port.find({}).sort({ _id: -1 }).limit(5);
	res.render("home", {
		posts: top5,
		ports: bottom5,
	});
};

const blogsPage = async (req, res) => {
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
		// console.log(iterator, endingLink); yinarko kaam khasai vaxaina aile to algi frontend ma
		res.render("blogs", {
			posts: paginatedposts,
			ports: paginatedports,
			page: page,
			iterator: iterator,
			endingLink: endingLink,
			numberOfPages: numberOfPages,
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

const mailer = function (req, res) {
	const coming_post = {
		fname: req.body.name,
		email: req.body.email,
		title: req.body.postTitle,
		content: req.body.postBody,
	};
	const output = `
    <h2>Get in Touch</h2>
    <h3>Details</h3>
    <ul>
      <li>Full Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h4>${req.body.postBody}</h4>
  `;

	async function sendMail() {
		try {
			const accessToken = await OAuth2Client.getAccessToken();

			const transport = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: "587",
				secure: false,
				service: "mail",
				auth: {
					type: "OAuth2",
					user: process.env.USER_SEND,
					clientId: clientId,
					clientSecret: clientSecret,
					refreshToken: refreshToken,
					accessToken: accessToken,
				},
			});

			const mailOptions = {
				from: `${coming_post.fname} <${process.env.USER_GET}>`,
				to: process.env.USER_GET,
				subject: coming_post.title,
				text: "Hello?",
				html: output,
			};

			const result = await transport.sendMail(mailOptions);
			return result;
		} catch (error) {
			return error;
		}
	}

	sendMail()
		.then((result) => console.log("Email sent.", result))
		.catch((error) => console.log(error.message));
	res.redirect("/");
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
	mailer,
	electPage,
	publishPage,
};
