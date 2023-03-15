const formDOM = document.querySelector(".form");
const usernameInputDOM = document.querySelector("#username_input");
const emailInputDOM = document.querySelector("#email_input");
const passwordInputDOM = document.querySelector("#password_input");

formDOM.addEventListener("submit", async (e) => {
	e.preventDefault();
	const username = usernameInputDOM.value;
	const email = emailInputDOM.value;
	const password = passwordInputDOM.value;

	try {
		const { data } = await axios.post("/admin/login", {
			username,
			email,
			password,
		});
		usernameInputDOM.value = "";
		emailInputDOM.value = "";
		passwordInputDOM.value = "";

		localStorage.setItem("token", data.token);
	} catch (error) {
		localStorage.removeItem("token");
		console.log(error);
	}
	setTimeout(2000);
});

const composebtnDOM = document.querySelector("#compose-btn");

composebtnDOM.addEventListener("click", async () => {
	const token = localStorage.getItem("token");
	try {
		const { data } = await axios.get("/compose", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		console.log(data.user);
	} catch (error) {
		localStorage.removeItem("token");
		console.log(error);
	}
});
