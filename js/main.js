import { findElement } from "./index.js";

const templateTop = findElement("#post-template"),
	fragment = document.createDocumentFragment(),
	templateBodyPost = findElement("#body-template"),
	fragmentBody = document.createDocumentFragment(),
	parentEL = findElement(".cards"),
	handlerEl = findElement("#article");

let posts = [];
let topPosts = [];

fetch("https://639b4a2a31877e43d6888973.mockapi.io/posts")
	.then((res) => res.json())
	.then((data) => {
		posts = data.reverse();
		renderTop(posts);
		renderbody(posts);
	})
	.catch((err) => {
		console.log(err);
	});

// render to top posts

function renderTop(posts, parenttag = parentEL) {
	posts.forEach((item) => {
		if (!item.top) {
			topPosts.push(item);
		}
	});
	for (let i = 0; i < 6; i++) {
		const post = topPosts[i];

		const templatePost = templateTop.content.cloneNode(true);

		const title = templatePost.querySelector("#title"),
			img = templatePost.querySelector("#img"),
			date = templatePost.querySelector("#date"),
			dateNow = {
				hour: new Date().getHours(),
				minutes: new Date().getMinutes(),
				date: new Date().getDate(),
				month: new Date().getMonth(),
				year: new Date().getFullYear(),
			};

		title.innerHTML = post.name;
		img.src = post.image;
		date.innerHTML = `${dateNow.hour}:${dateNow.minutes} / ${dateNow.date}.${dateNow.month}.${dateNow.year}`;

		fragment.append(templatePost);
	}

	parentEL.appendChild(fragment);
}

// render to body pposts

function renderbody(posts, parenttag = handlerEl) {
	parenttag.textContent = "";

	for (let i = 0; i < 6; i++) {
		const post = posts[i];

		const templateBody = templateBodyPost.content.cloneNode(true);

		const title = templateBody.querySelector("#title-body"),
			img = templateBody.querySelector("#img-body"),
			subtitle = templateBody.querySelector("#subtitle-body"),
			date = templateBody.querySelector("#date-body"),
			dateNow = {
				hour:
					new Date().getHours() < 10
						? "0" + new Date().getHours()
						: new Date().getHours(),
				minutes:
					new Date().getMinutes() < 10
						? "0" + new Date().getMinutes()
						: new Date().getMinutes(),
				date: new Date().getDate(),
				month: new Date().getMonth(),
				year: new Date().getFullYear(),
			};

		title.innerHTML = post.name;
		img.src = post.image;
		date.innerHTML = `${dateNow.hour}:${dateNow.minutes} / ${dateNow.date}.${dateNow.month}.${dateNow.year}`;
		subtitle.innerHTML = post.subtitle;

		fragmentBody.append(templateBody);
	}

	handlerEl.appendChild(fragmentBody);
}

// exchange the rates currancy

const dollor = findElement(".dollor"),
	rubl = findElement(".rubl"),
	eur = findElement(".eur");

fetch("https://v6.exchangerate-api.com/v6/41b1afe74063ffb7cc3e2009/latest/USD")
	.then((res) => res.json())
	.then((data) => {
		let UZS = +data.conversion_rates.UZS;
		let RUB = +data.conversion_rates.RUB;
		let EUR = +data.conversion_rates.EUR;

		setTimeout(() => {
			dollor.textContent = UZS.toFixed(2);
			rubl.textContent = RUB.toFixed(2);
			eur.textContent = EUR.toFixed(2);
		}, 2000);
	});


