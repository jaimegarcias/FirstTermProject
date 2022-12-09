const { ipcRenderer } = require("electron");


window.onload = (event) => {
	document.getElementById("carForm").onsubmit = (e) => {
		e.preventDefault();
		let productCode = document.getElementById("productCode").value;
		let productDescription = document.getElementById("productDescription").value;
		let quantityInStock = document.getElementById("quantityInStock").value;
		let buyPrice = document.getElementById("buyPrice").value;
		let imageURL = document.getElementById("imageURL").value;
		let productName = document.getElementById("productName").value;
		ipcRenderer.send("insert", {
			"productCode": productCode,
			"productDescription": productDescription,
			"quantityInStock": quantityInStock,
			"buyPrice": buyPrice,
			"imageURL": imageURL,
			"productName": productName
		})

		alert("Car inserted");
	}
}