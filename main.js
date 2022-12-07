// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
var { connection } = require("./conexio");

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	})

	// and load the index.html of the app.
	mainWindow.loadFile('index.html')
	mainWindow.webContents.openDevTools();

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();
	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

async function getProducts() {
	const customPromise = new Promise((resolve, reject) => {
		connection.connect(function (err) {
			if (err) throw err;
			connection.query("select productCode,productName,productDescription,quantityInStock,buyPrice,imageURL from products where imageURL is not null order by productCode", function (err, result, fields) {
				if (err) throw err;
				resolve(result);
			});
		});
	})

	return customPromise
}

ipcMain.on('Canal2', (e, args) => {
	getProducts().then(data => {
		console.log(data);
		e.sender.send('Canal2', data);
	}).catch(err => {
		console.log(err)
	});
});