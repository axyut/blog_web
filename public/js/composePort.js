// compose page port area
const formCDOM = document.querySelector(".formc");
const resultcDOM = document.querySelector(".resultc");

const port_year = document.querySelector("#port_year");
const port_title = document.querySelector("#port_title");
const port_imgSrc = document.querySelector("#port_imgSrc");
const port_topContent = document.querySelector("#port_topContent");
const port_body = document.querySelector("#port_body");

formCDOM.addEventListener("submit", async (e) => {
	e.preventDefault();
	console.log(
		port_year.value,
		port_title.value,
		port_imgSrc.value,
		port_topContent.value,
		port_body.value
	);
	const token = localStorage.getItem("token");
	try {
		const { data } = await axios.post(
			"/compose/port",
			{
				title: port_title.value,
				content: port_body.value,
				year: port_year.value,
				imgSrc: port_imgSrc.value,
				topContent: port_topContent.value,
			},
			{
				headers: {
					//"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		console.log(data);
		resultcDOM.innerHTML = `Success User: ${data.username}`;
	} catch (error) {
		localStorage.removeItem("token");
		resultcDOM.innerHTML = `You're Unauthenticated.`;
		console.log(error);
	}
});
