// src/main/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vpnAPI', {
    controlVPN: (action) => ipcRenderer.send('vpn-control', action),
});