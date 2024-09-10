// src/main/main.js
const { app, BrowserWindow, ipcMain, Notification } = require('electron')

const path = require('path');
const sudo = require('sudo-prompt');
const { exec } = require('child_process');

let mainwindow
function startVPN() {
    console.log("starting")

    const openvpnBinary = path.join(__dirname, '..', '..', 'openvpn', 'win32', 'openvpn.exe');
    const configFilePath = path.join(__dirname, '..', '..', 'openvpn', 'vpn_config', 'config-user234.ovpn');
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



    mainWindow.loadURL('http://localhost:5173');

}

ipcMain.on('reload-app', (event) => {
    mainWindow.reload(); // This will reload the React app
});

ipcMain.on('vpn-control', (event, action) => {
    if (action === 'start') {
        startVPN()
    }
    else if (action === 'stop') {
        stopVPN();
    }

})



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