#!/bin/bash

# This is called by the camera control service

# Activate virtual environment
# Replace with actual path, below is an example with user fse
source /home/fse/Documents/Projects/RPi-FSE-Truck/myvenv/bin/activate

# Navigate to the working directory and start the application with GPU acceleration disabled
# Replace with actual path, below is an example with user fse
cd /home/fse/Documents/Projects/RPi-FSE-Truck/camera-control
npm start -- --disable-gpu
