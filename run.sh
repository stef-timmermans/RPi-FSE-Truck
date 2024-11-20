#!/bin/bash

# NOTE: Script assumes myvenv contains installs for the program

# Navigate to the working directory and start the driver app
# This should be done by the WorkingDirectory parameter in the service file
# which calls this script.

# Activate virtual environment
source myvenv/bin/activate

# Navigate to the working directory and start the application with GPU acceleration disabled
cd camera-control
npm start -- --disable-gpu
