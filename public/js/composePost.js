// compose page post area
const formpostDOM = document.querySelector(".formPost");
const resultpostDOM = document.querySelector(".resultpost");
// const composebtnDOM = document.querySelector("#compose-btn");

const post_title = document.querySelector("#post_title");
const post_img = document.querySelector("#post_img");
const post_content = document.querySelector("#post_content");

formpostDOM.addEventListener("submit", async (e) => {
	e.preventDefault();
	console.log(post_title.value, post_img.value, post_content.value);
	const token = localStorage.getItem("token");
	try {
		const { data } = await axios.post(
			"/compose/blogs",
			{
				title: post_title.value,
				content: post_content.value,
				img: post_img.value,
			},
			{
				headers: {
					//"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		console.log(data);
		resultpostDOM.innerHTML = `Success. User: ${data.username}`;
	} catch (error) {
		localStorage.removeItem("token");
		resultpostDOM.innerHTML = `You're Unauthenticated.`;
		console.log(error);
	}
});
