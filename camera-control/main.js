const { app, BrowserWindow, ipcMain } = require('electron')
const { spawn } = require('child_process')

// Disable hardware acceleration
// Raspberry Pi does not support OpenGL calls
app.disableHardwareAcceleration()
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')

// Track the current state, starting in mode-0 (no camera program selected)
let currentMode = 'mode-0'
let currentProcess = null // Reference to the currently running child process

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

// Function to stop the current process
function stopCurrentProcess(signal = 'SIGINT') {
    if (currentProcess) {
        console.log(`Stopping process with PID: ${currentProcess.pid}`)
        currentProcess.kill(signal)
        currentProcess = null
    }
}

// IPC listener to switch modes with unique behaviors
ipcMain.on('switch-mode', (event, mode) => {
    if (mode !== currentMode) {
        // Stop the current mode with unique behavior based on its type
        stopCurrentProcess()

        // Update the mode and start the new process with unique behavior
        // It is necessary that the PWD of execution is /camera-control at
        // this point.
        currentMode = mode
        switch (mode) {
            case 'mode-1':
                // Start the first camera library
                // Replace dummy script call with functional script
                currentProcess = spawn('./scripts/dummy.sh')
                break
            case 'mode-2':
                // Start the second camera library
                currentProcess = spawn('python3', ['/path/to/repo2/main.py'])
                break
            case 'mode-3':
                // Start the third camera library
                currentProcess = spawn('python3', ['/path/to/repo3/main.py'])
                break
            default:
                // In mode-0, no behavior required
                currentProcess = null
                break
        }

        if (currentProcess) {
            currentProcess.stdout.on('data', (data) => {
                console.log(`Process Output: ${data}`)
            })

            currentProcess.stderr.on('data', (data) => {
                console.error(`Process Error: ${data}`)
            })

            currentProcess.on('close', (code) => {
                console.log(`Process exited with code: ${code}`)
            })
        }

        // Inform the renderer process of the new mode
        event.sender.send('update-mode', currentMode)
    }
})

// IPC listener for the power-off button
ipcMain.on('power-off', () => {
    stopCurrentProcess()
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
    stopCurrentProcess()
    app.quit()
})

// Run the GUI after the electron app loads
app.whenReady().then(() => {
    createWindow()
})
