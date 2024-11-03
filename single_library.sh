#!/bin/bash

# This is called by the camera control service

# Activate virtual environment
# Replace with actual path, below is an example with user fse
source /home/fse/Documents/Projects/RPi-FSE-Truck/myvenv/bin/activate

# Navigate to the working directory and start the gen-2-age-gender app in isolation
# Replace with actual path, below is an example with user fse
cd /home/fse/Documents/Projects/RPi-FSE-Truck/depthai-experiments/gen2-age-gender
python3 main.py
