const { app, BrowserWindow, ipcMain } = require('electron')
const { exec } = require('child_process')

// Disable hardware acceleration
// Raspberry Pi does not support OpenGL calls
app.disableHardwareAcceleration()
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')

// Track the current state, starting in mode-0 (no camera program selected)
let currentMode = 'mode-0'

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

    // Send the initial mode to the renderer process on window load
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('update-mode', currentMode)
    })
}

app.whenReady().then(createWindow)

// IPC listener to switch modes with unique behaviors
ipcMain.on('switch-mode', (event, mode) => {
    if (mode !== currentMode) {
        // Stop the current mode with unique behavior based on its type
        switch (currentMode) {
            case 'mode-1':
                // Required CD and kill process behavior for mode-1
                exec('pkill -SIGINT python')
                break
            case 'mode-2':
                // Required CD and kill process behavior for mode-2
                exec('pkill -SIGTERM python')
                break
            case 'mode-3':
                // Required CD and kill process behavior for mode-3
                break
            default:
                // In mode-0, no behavior required
                break
        }

        // Update the mode and start the new process with unique behavior
        // It is necessary that the PWD of execution is /camera-control at
        // this point.
        currentMode = mode
        switch (mode) {
            case 'mode-1':
                // Start the first camera library
                exec(`python3 /path/to/repo1/script.py`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Mode 1 Error: ${error.message}`)
                        return
                    }
                    console.log(`Mode 1 Output: ${stdout}`)
                })
                break
            case 'mode-2':
                // Start the second camera library
                exec(`python3 /path/to/repo2/script.py`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Mode 2 Error: ${error.message}`)
                        return
                    }
                    console.log(`Mode 2 Output: ${stdout}`)
                })
                break
            case 'mode-3':
                // Start the third camera library
                exec(`python3 /path/to/repo3/script.py`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Mode 3 Error: ${error.message}`)
                        return
                    }
                    console.log(`Mode 3 Output: ${stdout}`)
                })
                break
            default:
                // In mode-0, no behavior required
                break
        }

        // Inform the renderer process of the new mode
        event.sender.send('update-mode', currentMode)
    }
})

// IPC listener for the power-off button
ipcMain.on('power-off', () => {
    exec('sudo poweroff', (error, stdout, stderr) => {
        if (error) {
            console.error(`Power Off Error: ${error.message}`)
            return
        }
        // Raspberry Pi will now shutdown...
    })
})

// Close the application if the output GUI is deactivated
// This is handy when debugging (closing page on X11 will stop execution)
app.on('window-all-closed', () => {
    app.quit()
})
