const { ipcRenderer } = require("electron");

let products;
let productsList;


function renderProducts(tasks) {
	productsList.innerHTML = ``;
	tasks.forEach((t) => {
		productsList.innerHTML += `
		  <tr>
			<th scope="row">${t.productCode}</th>
			<td>${t.productName}</td>
			<td>${t.productDescription}</td>
			<td>${t.quantityInStock}</td>
			<td>${t.buyPrice}</td>
			<td><img src="${t.imageURL}"/></td>
			<td><button type="button" class="btn btn-primary">Edit</button></td>
			<td><button type="button" class="btn btn-danger">Delete</button></td>
		  </tr>`;
	});
}

window.onload = (event) =>{
	productsList = document.getElementById("products");
	ipcRenderer.send('Canal2',"asd");
};

ipcRenderer.on('Canal2',(e,args)=> {
	console.log(args);
	renderProducts(args);
});