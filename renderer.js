const { ipcRenderer } = require("electron");

let productsList, carForm,carFormTitle, productCode, productDescription, quantityInStock, buyPrice, imageURL, productName;

function renderProducts(tasks) {
	productsList.innerHTML = ``;
	tasks.forEach((t) => {
		let car = {
			"productCode": t.productCode,
			"productDescription": t.productDescription,
			"quantityInStock": t.quantityInStock,
			"buyPrice": t.buyPrice,
			"imageURL": t.imageURL,
			"productName": t.productName
		}
		productsList.innerHTML += `
		  <tr>
			<th scope="row">${t.productCode}</th>
			<td>${t.productName}</td>
			<td>${t.productDescription}</td>
			<td>${t.quantityInStock}</td>
			<td>${t.buyPrice}</td>
			<td><img class="carImage" src="${t.imageURL}"/></td>
			<td><button type="button" class="btn btn-primary" onclick="editar('${t.productCode}')">Edit</button></td>
			<td><button type="button" class="btn btn-danger" onclick="borrar('${t.productCode}')">Delete</button></td>
		  </tr>`;
	});
}

function editar(id) {
	productCode.value= id;
	carForm.removeAttribute("hidden");
	carFormTitle.removeAttribute("hidden");
}

function borrar(id) {
	ipcRenderer.send("delete", id);
	alert("Car deleted.");
}

window.onload = (event) => {
	productsList = document.getElementById("products");
	ipcRenderer.send('Canal2', "asd");
	carFormTitle = document.getElementById("carFormTitle");
	carForm = document.getElementById("carForm");
	productCode = document.getElementById("productCode");
	productDescription = document.getElementById("productDescription");
	quantityInStock = document.getElementById("quantityInStock");
	buyPrice = document.getElementById("buyPrice");
	imageURL = document.getElementById("imageURL");
	productName = document.getElementById("productName");
	carForm.onsubmit = (e) => {
		e.preventDefault();
		ipcRenderer.send("edit", {
			"productCode": productCode.value,
			"productDescription": productDescription.value,
			"quantityInStock": quantityInStock.value,
			"buyPrice": buyPrice.value,
			"imageURL": imageURL.value,
			"productName": productName.value
		})
		carForm.setAttribute("hidden", true);
		carFormTitle.setAttribute("hidden", true);

		alert("Car updated");
	}
};

ipcRenderer.on('Canal2', (e, args) => {
	renderProducts(args);
});