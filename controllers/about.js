const privacy = function (req, res) {
	res.render("aboutprivacy");
};

const terms = function (req, res) {
	res.render("aboutterms");
};

const website = function (req, res) {
	res.render("aboutwebsite");
};

module.exports = { privacy, terms, website };
