#!/bin/bash

# NOTE: Script assumes myvenv contains installs for the program

# Navigate to the working directory and start the demo app in isolation
# This should be done by the WorkingDirectory parameter in the service file
# which calls this script.

# Activate virtual environment
source myvenv/bin/activate

# Go to app directory and run
cd depthai
python depthai_demo.py
