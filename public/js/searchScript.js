function sendData(e) {
	const searchResults = document.getElementById("searchResults");
	let match = e.value.match(/^[ a-zA-Z ]*/);
	let match2 = e.value.match(/\s*/);
	if (match2[0] === e.value) {
		searchResults.innerHTML = "";
		return;
	}
	if (match[0] === e.value) {
		fetch("getPosts", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ payload: e.value }),
		})
			.then((res) => res.json())
			.then((data) => {
				let Post = data.searchPost;
				let Port = data.searchPort;
				//console.log(Post, Port);
				searchResults.innerHTML = "";
				if (Post.length < 1 && Port.length < 1) {
					searchResults.innerHTML = "<p>Sorry. Nothing found.</p>";
					return;
				}
				Post.forEach((item, index) => {
					if (index > 0) searchResults.innerHTML += "<hr>";
					searchResults.innerHTML += `<a id="searchAnchor" href="/posts/${item._id}"><p>${item.title}</p></a>`;
				});
				if (Post.length != 0) searchResults.innerHTML += "<hr>";
				Port.forEach((item, index) => {
					if (index > 0) searchResults.innerHTML += "<hr>";
					searchResults.innerHTML += `<a id="searchAnchor" href="/port/${item._id}"><p>${item.title}</p></a>`;
				});
			});
		return;
	}
	searchResults.innerHTML = "";
}
