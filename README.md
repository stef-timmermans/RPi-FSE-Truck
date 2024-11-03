# FSE Truck: Raspberry Pi Camera App

This repository houses the application for the University of Groningen Faculty of Science and Engineering (FSE) Science Truck's Raspberry Pi camera application.

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

After this, the "frontend" of the application should work in isolation. This can be tested by running `npm start` in the `camera-control/` directory (found in root of repository). If everything has been cloned in the correct place, `npm start` should run the entire application as a whole.

## Using a Remote Display

By default, the Raspberry Pi does not have a built-in display, thus the DepthAI software will fail when run in isolation. However, using X11-forwarding, the Pi can connect to a remote display via SSH, due to the Pi having its own connectivity hardware. On another machine, SSH to the Pi with the following configuration:

```
Host truck
    HostName ####
    User ####
    ForwardX11 yes
    ForwardX11Trusted yes
```

This configuration should work for most, if not all, operating systems on a secondary machine. If using the Pi's built-in HDMI support, this step is not necessary.

## Starting Application From Boot

Usually, SSH-ing into the Pi is not practical, especially when the application is used by general employees. For that reason, it is important to define a startup service for the Electron app (which will later call on more scripts to run the relevant libraries).

From the default folder (`cd ~`), create a new file to tell the Pi what to do on startup through `sudo vim /etc/systemd/system/camera-control.service`. In this file, paste in the following configuration (replace all instances of placeholder `###` with the user name):

```
[Unit]
Description=Start Camera Control Application
After=network.target

[Service]
ExecStart=/bin/bash -c '/usr/bin/npm start >> /home/###/camera-control.log 2>&1'
WorkingDirectory=/home/###/Documents/Projects/RPi-FSE-Truck/camera-control
Restart=always
User=###
Environment="PATH=/home/###/Documents/Projects/RPi-FSE-Truck/camera-control/node_modules/.bin:/usr/local/bin:/usr/bin:/bin"

[Install]
WantedBy=multi-user.target

```

This configuration assumes that the repo was cloned in `/Documents/Projects`. It also assumes that `npm install` has been run in the frontend subfolder (`/Documents/Projects/RPi-FSE-Truck/camera-control`), which should add Electron to the node_modules binaries. If this does not happen, run `npm install electron` after installing all other dependencies.

This can be enabled via `sudo systemctl enable camera-control`. Likewise, it can be disabled via `sudo systemctl disable camera-control`. After enabling, this service will run after the Pi has sucessfully booted.

**Note:** The Pi at this point expects displays to connect to; this service will not run in headless mode or via X11-forwarding.
