#!/bin/bash

# This is called by the camera control service

# Activate virtual environment
source /home/fse/Documents/Projects/RPi-FSE-Truck/myvenv/bin/activate

# Navigate to the working directory and start the application with GPU acceleration disabled
cd /home/fse/Documents/Projects/RPi-FSE-Truck/camera-control
npm start -- --disable-gpu
