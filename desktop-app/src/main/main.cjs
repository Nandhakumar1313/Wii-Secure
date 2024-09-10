// src/main/main.js
const { app, BrowserWindow, ipcMain, Notification } = require('electron')

const path = require('path');
const sudo = require('sudo-prompt');
const { exec } = require('child_process');

function getResourcePath(subPath) {
    if (app.isPackaged) {

        return path.join(process.resourcesPath, subPath);
    } else {

        return path.join(__dirname, '..', '..', subPath);
    }
}

let mainwindow
function startVPN() {
    console.log("starting")

    const openvpnBinary = getResourcePath('openvpn/win32/openvpn.exe');
    const configFilePath = getResourcePath('openvpn/vpn_config/config-user234.ovpn');
    const command = `"${openvpnBinary}" --config "${configFilePath}"`;

    sudo.exec(command, { name: 'OpenVPN Connection' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting VPN: ${error.message}`);
            return;
        }
        console.log(`VPN stdout: ${stdout}`);
        if (stderr) {
            console.error(`VPN stderr: ${stderr}`);
        }
    });
}

function stopVPN() {
    sudo.exec('taskkill /F /IM openvpn.exe', { name: 'VPN Stopper' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error stopping VPN: ${error.message}`);
            return;
        }
        console.log(`VPN stopped: ${stdout}`);
        if (stderr) {
            console.error(`VPN stderr: ${stderr}`);
        }
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    console.log(`Loading preload script: ${path.join(__dirname, 'preload.cjs')}`);

    mainWindow.webContents.on('preload-error', (event, preloadPath, error) => {
        console.error(`Error loading preload script: ${error.message}`);
    });

    if (app.isPackaged) {
        const indexPath = path.join(__dirname, '..', '..', 'dist', 'index.html');
        console.log(`Loading production HTML from: ${indexPath}`); // Log the path
        mainWindow.loadFile(indexPath)
            .catch(err => console.error(`Error loading file: ${err.message}`)); // Catch load errors
    } else {
        console.log('Loading development server at http://localhost:5173');
        mainWindow.loadURL('http://localhost:5173')
            .catch(err => console.error(`Error loading URL: ${err.message}`)); // Catch load errors
    }

    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Main window content fully loaded');
    });

    // Log if there are any issues during loading
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error(`Failed to load: ${errorDescription} (Error Code: ${errorCode})`);
    });

}

ipcMain.on('reload-app', (event) => {
    console.log('Received reload-app event');
    mainWindow.reload(); // This will reload the React app
});

ipcMain.on('vpn-control', (event, action) => {
    console.log(`Received vpn-control event with action: ${action}`);

    if (action === 'start') {
        startVPN();
    } else if (action === 'stop') {
        stopVPN();
    } else {
        console.error(`Unknown action: ${action}`);
    }
});



app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});