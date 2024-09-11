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
let devProcess
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
function startdevProcess() {
    // Start the Vite development server using "npm run dev"
    devProcess = exec('npm run preview', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing npm run dev: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
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
        // Production: Load the index.html from the dist folder (relative to the executable location)
        // const indexPath = path.join(__dirname, '..', '..', 'dist', 'index.html');

        startdevProcess()

        mainWindow.loadURL('http://localhost:4173').catch(err => console.error(`Error loading URL: ${err.message}`));
    } else {
        // Development: Load from Vite server
        startdevProcess()
        console.log('Loading development server at http://localhost:4173');
        mainWindow.loadURL('http://localhost:4173').catch(err => console.error(`Error loading URL: ${err.message}`));
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


ipcMain.on('get-dirname', (event) => {
    const dirname = __dirname;
    event.returnValue = dirname;  // Send the dirname as a synchronous response
});


app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
    if (devProcess) {
        devProcess.kill();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});