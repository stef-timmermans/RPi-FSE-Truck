const { app, BrowserWindow, ipcMain } = require('electron')
const { exec } = require('child_process')

// Disable hardware acceleration
// Raspberry Pi does not support OpenGL calls
app.disableHardwareAcceleration()

// Define a window for the GUI
function createWindow() {
    const win = new BrowserWindow({
        // Use dimensions of the Raspberry Pi 7-inch Touchscreen
        // Modify the two lines below if using a different visual output
        width: 800,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(createWindow)

// IPC listeners for button actions
ipcMain.on('switch-mode', (event, mode) => {
    exec(`python3 /path/to/${mode}/script.py`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`)
            return
        }
        console.log(`Output: ${stdout}`)
    })
})

ipcMain.on('power-off', () => {
    exec('sudo poweroff')
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
