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

module.exports = mailer;
