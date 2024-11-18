# FSE Truck: Raspberry Pi Camera App

This repository houses the application for the University of Groningen Faculty of Science and Engineering (FSE) Science Truck's Raspberry Pi camera application.

[**Read more about the FSE Truck here!**](https://jouwenergievanmorgen.nl)

## Hardware Dependencies

This application is designed to run on a Raspberry Pi setup, with the following hardware configuration:

- [Raspberry Pi 5](https://www.raspberrypi.com/documentation/)
- [Arducam PiNSIGHT](https://docs.arducam.com/Raspberry-Pi-Camera/Arducam-PiVistation/Vision-AI-Kit/Arducam-PiNSight/)
- [Raspberry Pi Touch Display (v1.1)](https://www.raspberrypi.com/documentation/accessories/display.html)

## Setup Instructions

1. To use the Arducam with DepthAI software, run the following commands:

```
wget https://github.com/ArduCAM/arducam_ppa/releases/download/v1.0.2/pinsight_install_dependencies.sh
chmod +x pinsight_install_dependencies.sh
./pinsight_install_dependencies.sh
```

2. To use the additional software needed for the various output modes, clone the DepthAI experiments repository in the project root:
```
git clone https://github.com/luxonis/depthai-experiments.git
```

3. To allow the Electron application to serve buttons for the touchscreen, run the following:
```
sudo apt update
sudo apt install nodejs npm
```

After this, the "frontend" of the application should work in isolation. This can be tested by running `npm start` in the `camera-control/` directory (found in root of repository). If all of the following appropriate steps in this document have been followed, `npm start` should run the entire application as a whole.

4. To correctly install all dependencies, set up a virtual environment and install all required dependencies depending on modes from `depthai-experiments`. These instructions create an environment named `myvenv`.
```
python3 -m venv myvenv
source myvenv/bin/activate
cd depthai-experiments/gen2-emotion-recognition
python3 -m pip install -r requirements.txt
cd ../gen2-people-counter
python3 -m pip install -r requirements.txt
cd ../..
```

To leave the venv enter `deactivate`. To re-enter, type `source myvenv/bin/activate`.

## Starting Application From Boot

***Note:** The Pi at this point expects displays to connect to; the full application will not run in headless mode or via X11-forwarding unless using a more nuanced configuration (possibly through RealVNC).*

Usually, SSH-ing into the Pi is not practical, especially when the application is used by general employees. For that reason, it is important to define a startup service for the Electron app (which will later call on more scripts to run the relevant libraries).

Create a new file to tell the Pi what to do on startup through `sudo vim /etc/systemd/system/camera-control.service`. In this file, paste in the following configuration (replace all instances of placeholder `###` with the user name):

```
[Unit]
Description=Start Camera Control Application
After=network.target

[Service]
ExecStart=/home/###/Documents/Projects/RPi-FSE-Truck/run.sh > /home/###/camera-control.log 2>&1
WorkingDirectory=/home/###/Documents/Projects/RPi-FSE-Truck
Restart=always
User=###

[Install]
WantedBy=multi-user.target

```

This configuration assumes that the repo was cloned in `/Documents/Projects` and that all appropriate dependencies have been installed as described above. It also assumes that `npm install` has been run in the frontend subfolder (`/Documents/Projects/RPi-FSE-Truck/camera-control`), which should add Electron to the node_modules binaries. If this does not happen, run `npm install electron` after installing all other dependencies.

This can be enabled via `sudo systemctl enable camera-control`. Likewise, it can be disabled via `sudo systemctl disable camera-control`. After enabling, this service will run after the Pi has sucessfully booted.

If wanting to run a single library in isolation, define a different service file. The `single_library.sh` in the project root is an example that can be called. An example is as follows (replace all instances of placeholder `###` with the user name):

```
[Unit]
Description=Run DepthAI Default Application
After=network.target

[Service]
ExecStart=/home/###/Documents/Projects/RPi-FSE-Truck/single_library.sh > /home/###/depthai-test.log 2>&1
WorkingDirectory=/home/###/Documents/Projects/RPi-FSE-Truck
Restart=always
User=###

[Install]
WantedBy=multi-user.target

```

## Using a Remote Display

By default, the Raspberry Pi does not have a built-in display, thus the DepthAI software will fail when run in isolation. However, using X11-forwarding, the Pi can connect to a remote display via SSH, due to the Pi having its own connectivity hardware. This can be useful when testing individual libraries or the frontend in isolation. On another machine, SSH to the Pi with the following configuration:

```
Host truck
    HostName ####
    User ####
    ForwardX11 yes
    ForwardX11Trusted yes
```

This configuration should work for most, if not all, operating systems on a secondary machine. If using the Pi's built-in HDMI support, this step is not necessary.
