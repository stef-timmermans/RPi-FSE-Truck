#!/bin/bash

# Navigate to the working directory and start the demo app in isolation
# This should be done by the WorkingDirectory parameter in the service file
# which calls this script.

# No virtual environment (apparently) necessary for this demo due to
# install configuration from ArduCam.

# Go to app directory and run
cd depthai
python depthai_demo.py
