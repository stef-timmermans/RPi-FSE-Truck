const { app, BrowserWindow, ipcMain } = require('electron')
const { spawn, exec } = require('child_process')
const path = require('path')
const inspector = require("node:inspector");

// Disable hardware acceleration
// Raspberry Pi does not support OpenGL calls
app.disableHardwareAcceleration()
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')

// PiNSIGHT paths (assuming correct install)
const demoPath = path.join(__dirname, '..', 'depthai', 'depthai_demo.py');
// const emotionPath = path.join(__dirname, '..', 'depthai-experiments', 'gen2-emotion-recognition', 'main.py');
// const ageGenderPath = path.join(__dirname, '..', 'depthai-experiments', 'gen2-age-gender', 'main.py');
const gazeEstimationPath = path.join(__dirname, '..', 'depthai-experiments', 'gen2-gaze-estimation', 'main.py');
const humanPosePath = path.join(__dirname, '..', 'depthai-experiments', 'gen2-human-pose', 'main.py');

// Environment paths
const demoEnv = '/home/fse/Documents/Projects/RPi-FSE-Truck/demo-env/bin/python'
// const emotionEnv = '/home/fse/Documents/Projects/RPi-FSE-Truck/emotion-env/bin/python'
// const ageGenderEnv = '/home/fse/Documents/Projects/RPi-FSE-Truck/age-gender-env/bin/python'
const gazeEstimationEnv = '/home/fse/Documents/Projects/RPi-FSE-Truck/gaze-estimation-env/bin/python'
const humanPoseEnv = '/home/fse/Documents/Projects/RPi-FSE-Truck/human-pose-env/bin/python'

// Track the current state, starting in mode-0 (no camera program selected)
let currentMode = 'mode-0'
let currentProcess = null

// Sleep for a given time interval (to await camera I/O)
const sleep = (ms) => new Promise(
    resolve => setTimeout(resolve, ms)
);

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

    // Use the index html file for the window
    win.loadFile('index.html')
        .then(() => {
          win.webContents.send('update-mode', currentMode)
        })
        .catch(err => {
          console.error('Failed to load index.html:', err)
        })
    }

// IPC listener to switch modes with unique behaviors
ipcMain.on('switch-mode', async (event, mode) => {
    if (mode !== currentMode) {
        // Stop the current mode
        await stopCurrentProcess()

        // Update the mode and start the new process with unique behavior
        // It is necessary that the PWD of execution is /camera-control at
        // this point.
        currentMode = mode
        switch (mode) {
            case 'mode-1':
                // Start the first camera library: DepthAI Demo
                console.log("\nCalling script for child process #1...")
                currentProcess = spawn(demoEnv, [demoPath], {
                    shell: true,
                    detached: true,
                    stdio: ['ignore', 'pipe', 'pipe']
                })
                break
            case 'mode-2':
                // Start the second camera library: Gaze Estimation
                console.log("\nCalling script for child process #2...")
                currentProcess = spawn(gazeEstimationEnv, [gazeEstimationPath], {
                    shell: true,
                    detached: true,
                    stdio: ['ignore', 'pipe', 'pipe']
                })
                break
            case 'mode-3':
                // Start the third camera library: Human Pose
                console.log("\nCalling script for child process #3...")
                currentProcess = spawn(humanPoseEnv, [humanPosePath, '-cam'], {
                    shell: true,
                    detached: true,
                    stdio: ['ignore', 'pipe', 'pipe']
                })
                break
            default:
                // In mode-0, no behavior required
                currentProcess = null
                break
        }

        // Log relevant process information
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

// Stops the current process (delivers a SIGTERM signal to the child)
async function stopCurrentProcess(signal = 'SIGTERM') {
    if (!currentProcess) {
        return;
    }

    console.log(`Stopping process with PID: ${currentProcess.pid}`);
    const proc = currentProcess;
    currentProcess = null;

    await new Promise((resolve) => {
        proc.once('close', resolve);
        try {
            process.kill(-proc.pid, signal);
        } catch (err) {
            console.error('Failed to kill process group:', err);
            resolve();
        }
    });
    console.log('Process fully exited.');
    console.log('Sleeping for three seconds...');
    await sleep(3000);
}

// IPC listener for the power-off button
ipcMain.on('power-off', async () => {
    await stopCurrentProcess()
    exec('sudo poweroff', (error, stdout, stderr) => {
        if (error) {
            console.error(`Power Off Error: ${error.message}`)
        }
        // Raspberry Pi will now shut down...
    })
})

// Close the application if the output GUI is deactivated
// This is handy when debugging (closing page on X11 will stop execution)
app.on('window-all-closed', async () => {
    await stopCurrentProcess()
    app.quit()
})

// Run the GUI after the electron app loads
app.whenReady().then(() => {
    createWindow()
})
