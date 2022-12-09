const { ipcRenderer } = require("electron");

let productsList;

window.onload = (event) => {
	productsList = document.getElementById("products");
	ipcRenderer.send('Canal2', "asd");
};

ipcRenderer.on('Canal2', (e, args) => {
	renderProducts(args);
});


function renderProducts(tasks) {
	productsList.innerHTML = ``;
	tasks.forEach((t) => {
		productsList.innerHTML += `
		<div class="card">
		<img class="card-img-top" src="${t.imageURL}" alt="Card image cap">
		<div class="card-body">
			<h5 class="card-title">${t.productName}</h5>
			<p class="card-text">${t.productDescription}</p>
		</div>
	</div>`;
	});
}