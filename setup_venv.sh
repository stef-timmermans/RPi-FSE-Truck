#!/bin/bash

# Exit script on any command failure
set -e

# Create a Python virtual environment
python3 -m venv myvenv

# Activate the virtual environment
source myvenv/bin/activate

# Install dependencies for depthai general demo
cd depthai
python3 -m pip install -r requirements.txt

# Install dependencies for gen2-emotion-recognition
cd ../depthai-experiments/gen2-emotion-recognition
python3 -m pip install -r requirements.txt

# Install dependencies for gen2-people-counter
cd ../gen2-people-counter
python3 -m pip install -r requirements.txt

# Return to the root directory
cd ../..

# Deactivate the virtual environment
# (As it's assumed that the startup script will
# activate the virtual environment)
deactivate
