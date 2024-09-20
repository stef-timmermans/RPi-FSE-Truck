# FSE Truck: Raspberry Pi Camera App

This repository houses the application for the University of Groningen Faculty of Science and Engineering (FSE)'s science truck Raspberry Pi application.

*(TODO)*

## Hardware Dependencies

This application is designed to run on a Raspberry Pi setup, with the following hardware configuration:

- [Raspberry Pi 5](https://www.raspberrypi.com/documentation/)
- [Arducam PiNSIGHT](https://docs.arducam.com/Raspberry-Pi-Camera/Arducam-PiVistation/Vision-AI-Kit/Arducam-PiNSight/)
- Raspberry Pi Touch Display (v1.1)

## Setup Instructions

1. To use the Arducam with DepthAI software, run the following script:

```
wget https://github.com/ArduCAM/arducam_ppa/releases/download/v1.0.2/pinsight_install_dependencies.sh
chmod +x pinsight_install_dependencies.sh
./pinsight_install_dependencies.sh
```
