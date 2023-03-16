const formDOM = document.querySelector(".formp");
const usernameInputDOM = document.querySelector("#username_input");
const emailInputDOM = document.querySelector("#email_input");
const passwordInputDOM = document.querySelector("#password_input");
const resultpDOM = document.querySelector(".resultp");
const composebtnDOM = document.querySelector("#compose-btn");

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
		composebtnDOM.style.display = "";
		resultpDOM.innerHTML = "Successfully logged In";
	} catch (error) {
		localStorage.removeItem("token");
		resultpDOM.innerHTML = "Error Logging in.";
		console.log(error);
	}
	setTimeout(2000);
});

const checkToken = async () => {
	composebtnDOM.style.display = "none";
	const token = localStorage.getItem("token");
	if (token) {
		composebtnDOM.style.display = "";
	}
};
checkToken();
