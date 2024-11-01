# FSE Truck: Raspberry Pi Camera App

This repository houses the application for the University of Groningen Faculty of Science and Engineering (FSE)'s science truck Raspberry Pi application.

*(TODO)*

## Hardware Dependencies

This application is designed to run on a Raspberry Pi setup, with the following hardware configuration:

- [Raspberry Pi 5](https://www.raspberrypi.com/documentation/)
- [Arducam PiNSIGHT](https://docs.arducam.com/Raspberry-Pi-Camera/Arducam-PiVistation/Vision-AI-Kit/Arducam-PiNSight/)
- [Raspberry Pi Touch Display (v1.1)](https://www.raspberrypi.com/documentation/accessories/display.html)

## Setup Instructions

1. To use the Arducam with DepthAI software, run the following script:

```
wget https://github.com/ArduCAM/arducam_ppa/releases/download/v1.0.2/pinsight_install_dependencies.sh
chmod +x pinsight_install_dependencies.sh
./pinsight_install_dependencies.sh
```

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
