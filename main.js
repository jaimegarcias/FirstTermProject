// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path');
const { menu } = require('./menu');
var { connection } = require("./conexio");

let carId;
let mainWindow;
let modalWindow;

const createWindow = () => {
	// Create the browser window.
	 mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	})

	modalWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		parent: mainWindow,
		modal: true,
		show: false
	})

	// and load the index.html of the app.
	mainWindow.loadFile('index.html')
	mainWindow.webContents.openDevTools();

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
	
	Menu.setApplicationMenu(menu);

	modalWindow.on("close", event =>{
		event.preventDefault();
		modalWindow.hide();
	})
	
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	connection.connect(function (err) {
		if (err) throw err;
	});
	createWindow();
	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
	module.exports = { mainWindow, modalWindow };
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

async function getProducts() {
	const customPromise = new Promise((resolve, reject) => {
		connection.query("select productCode,productName,productDescription,quantityInStock,buyPrice,imageURL from products where imageURL is not null order by productCode", function (err, result, fields) {
			if (err) throw err;
			resolve(result);
		});
	})

	return customPromise
}

//Consultes a la BBDD
async function deleteCar(id){
	connection.query("delete from products where productCode like '"+ id + "';", function (err, result, fields) {
		if (err) throw err;
	});
}

async function insertCar(car){
	connection.query("INSERT INTO products (productCode, productName, productDescription, quantityInStock,buyPrice, imageURL) VALUES ('"+car.productCode+"', '"+car.productName+"', '"+car.productDescription+"', "+car.quantityInStock+", "+car.buyPrice+", '"+car.imageURL+"');", function (err, result, fields) {
		if (err) throw err;
	});
}

async function updateCar(car){
	connection.query('update products set productName = "'+car.productName+'", productDescription = "'+car.productDescription+'", quantityInStock = "'+car.quantityInStock+'", buyPrice="'+car.buyPrice+'", imageURL = "'+car.imageURL+'" where productCode = "'+car.productCode+'";', function (err, result, fields) {
		if (err) throw err;
	});
	
}

//Conexions entre els renderers i el main

ipcMain.on('Canal2', (e, args) => {
	getProducts().then(data => {
		e.sender.send('Canal2', data);
	}).catch(err => {
		console.log(err)
	});
});

ipcMain.on("delete", (e, args) => {
	deleteCar(args);
	getProducts().then(data => {
		e.sender.send('Canal2', data);
	}).catch(err => {
		console.log(err)
	});
});

ipcMain.on("insert", (e, args) => {
	insertCar(args);
	getProducts().then(data => {
		e.sender.send('Canal2', data);
	}).catch(err => {
		console.log(err)
	});
});

ipcMain.on("edit", (e, args) => {
	updateCar(args);
	getProducts().then(data => {
		e.sender.send('Canal2', data);
	}).catch(err => {
		console.log(err)
	});
});