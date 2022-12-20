import { findElement } from "./index.js";

// variables

const elInputTitle = findElement("#title"),
	elForm = findElement(".form"),
	elInputSubtitle = findElement("#subtitle"),
	elInputImg = findElement("#image"),
	elCheckbox = findElement("#checkbox"),
	elSuccess = findElement("#succes"),
	elPostDel = findElement(".main"),
	elmodal = findElement(".modal"),
	editClosebtn = findElement("#closeEdit-btn"),
	elEditModal = findElement(".editModal"),
	closebtn = findElement("#close-btn"),
	closeModal = findElement("#close"),
	elBtn = findElement("#btn"),
	elModalEdit = findElement("#UpdateBtn");

// variables edit

const modalInputTitle = findElement("#edit-title"),
	modalInputSubtitle = findElement("#edit-subtitle"),
	elmodalImg = findElement("#edit-image");

const templateAdmin = findElement("#admin-template"),
	mainAdmin = findElement(".main"),
	fragmentAdmin = document.createDocumentFragment();

let posts = [];

// Create post template

elForm.addEventListener("submit", (evt) => {
	evt.preventDefault();

	const elTitle = elInputTitle.value,
		elSubtitle = elInputSubtitle.value,
		elImg = elInputImg.value.trim(),
		isTop = !elCheckbox.checked;

	fetch("https://639b4a2a31877e43d6888973.mockapi.io/posts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			createdAt: "2022-12-15T15:14:16.982Z",
			image: elImg,
			name: elTitle,
			subtitle: elSubtitle,
			top: isTop,
		}),
	})
		.then((res) => {
			res.json();
		})
		.catch((data) => {
			console.log(data);
		});

	elSuccess.classList.remove("d-none");
	setTimeout(() => {
		setTimeout(() => {
			elSuccess.classList.add("d-none");
			elSuccess.style.transition = "all 0.6s ease-out ";
			elForm.reset();
		}, 500);
	}, 1500);
});

// template posts

fetch("https://639b4a2a31877e43d6888973.mockapi.io/posts")
	.then((res) => res.json())
	.then((data) => {
		posts = data.reverse();
		renderAdmin(posts);
	})
	.catch((err) => {
		console.log(err);
	});

function renderAdmin(posts, parenttag = mainAdmin) {
	parenttag.textContent = "";
	posts.forEach((post) => {
		const templateAdminPost = templateAdmin.content.cloneNode(true);

		const title = templateAdminPost.querySelector("#title-body"),
			img = templateAdminPost.querySelector("#img-body"),
			subtitle = templateAdminPost.querySelector("#subtitle-body"),
			date = templateAdminPost.querySelector("#date-body"),
			isTop = templateAdminPost.querySelector("#isTop"),
			delbtn = templateAdminPost.querySelector("#delete"),
			editBtn = templateAdminPost.querySelector("#editBtn"),
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
		isTop.textContent = `Is top post :  ${post.top}`;
		delbtn.dataset.id = post.id;
		editBtn.dataset.id = post.id;

		fragmentAdmin.append(templateAdminPost);
	});
	mainAdmin.appendChild(fragmentAdmin);
}

// deleting a post

elPostDel.addEventListener("click", (e) => {
	const id = +e.target.dataset.id;
	if (e.target.matches("#delete")) {
		modalActive();

		elBtn.addEventListener("click", () => {
			fetch(`https://639b4a2a31877e43d6888973.mockapi.io/posts/${id}`, {
				method: "DELETE",
			})
				.then((data) => {
					alert("removed succesfully");
					location.reload();
				})
				.catch((err) => console.log(err));
			modalRemove();
		});
		closebtn.addEventListener("click", () => {
			modalRemove();
		});
		closeModal.addEventListener("click", () => {
			modalRemove();
		});
	} else if (e.target.matches("#editBtn")) {
		fetch(`https://639b4a2a31877e43d6888973.mockapi.io/posts/${id}`)
			.then((data) => data.json())
			.then((data) => {
				const editTitle = modalInputTitle;
				const editSubtitle = modalInputSubtitle;
				const editImage = elmodalImg;

				editTitle.value = data.name;
				editSubtitle.value = data.subtitle;
				editImage.value = data.image;

				elModalEdit.addEventListener("click", () => {
					const post = {
						name: editTitle.value,
						subtitle: editSubtitle.value,
						image: editImage.value,
					};
					fetch(
						`https://639b4a2a31877e43d6888973.mockapi.io/posts/${id}`,
						{
							method: "put",
							body: JSON.stringify(post),
							headers: {
								"Content-type": "application/json; charset=UTF-8",
							},
						}
					)
						.then((res) => res.json())
						.then((data) => {
							location.reload();
						});
					modalEditRemove();
				});
				editClosebtn.addEventListener("click", () => {
					modalEditRemove();
				});
			})
			.catch((err) => console.log(err));

		modalEditShow();
	}
});

// modal sectionGET

function modalActive() {
	elmodal.style.display = "block";
	document.body.style.overflow = "hidden";
}

function modalRemove() {
	elmodal.style.display = "none";
	document.body.style.overflow = "auto";
}

function modalEditShow() {
	elEditModal.style.display = "block";
	document.body.style.overflow = "hidden";
}

function modalEditRemove() {
	elEditModal.style.display = "none";
	document.body.style.overflow = "auto";
}
