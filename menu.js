const { app, BrowserWindow, Menu } = require('electron')
const isMac = process.platform === 'darwin'


const template = [
	// { role: 'appMenu' }
	...(isMac ? [{
		label: app.name,
		submenu: [
			{ role: 'about' },
			{ type: 'separator' },
			{ role: 'services' },
			{ type: 'separator' },
			{ role: 'hide' },
			{ role: 'hideOthers' },
			{ role: 'unhide' },
			{ type: 'separator' },
			{ role: 'quit' }
		]
	}] : []),
	// { role: 'fileMenu' }
	{
		label: 'Home',
		submenu: [
			{
				label: 'Home page',
				click() {
					const { mainWindow } = require("./main")
					mainWindow.loadFile("index.html");
				}
			}
		]
	}, {
		label: 'Administration',
		submenu: [
			{
				label: 'List',
				click() {
					const { mainWindow } = require("./main")
					mainWindow.loadFile("carList.html");
				}
			},
			{
				label: 'Create car group',
				click() {
					const { modalWindow } = require("./main")
					modalWindow.loadFile("insertCar.html");
					modalWindow.show();
				}
			}
			
		]
	}
]

const menu = Menu.buildFromTemplate(template)
module.exports.menu = Menu.buildFromTemplate(template);

var newWindow = null

function openAboutWindow() {
	if (newWindow) {
		newWindow.focus()
		return
	}

	newWindow = new BrowserWindow({
		width: 1200, height: 800,
		minWidth: 300, minHeight: 150,


		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
		},
	})

	newWindow.loadFile('carList.html')

	newWindow.on('closed', function () {
		newWindow = null
	})
}
