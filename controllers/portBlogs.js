const Port = require("../model/Port");
const fs = require("fs");

const portBlogs = async (req, res) => {
	const requestedPortId = req.params.portId;
	try {
		const port = await Port.findOne({ _id: requestedPortId });
		res.render("portDisplay", {
			title: port.title,
			topContent: port.topContent,
			content: port.content,
		});
	} catch (error) {
		console.log(error);
	}
};
const resumePage = function (req, res) {
	fs.readFile("./public/files/port.json", (err, json) => {
		let obj = JSON.parse(json);
		res.json(obj);
	});
};

module.exports = { portBlogs, resumePage };
