// src/main/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vpnAPI', {
    controlVPN: (action) => ipcRenderer.send('vpn-control', action),
});

contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => ipcRenderer.send(channel, data),
});


contextBridge.exposeInMainWorld('electronAPI', {
    getDirname: () => {
        // Send a request to the main process to get the dirname and return the result
        return ipcRenderer.sendSync('get-dirname');  // Use sendSync to get a synchronous response
    }
});