#!/bin/bash

# Exit script on any command failure
set -e

# Ensure DepthAI default programs exist
cd depthai
cd ..

# Ensure DepthAI Experiments programs exist
cd depthai-experiments
cd ..

# Create a Python virtual environment
python3 -m venv myvenv

# Activate the virtual environment
source myvenv/bin/activate

# Install npm (for frontend packages)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install --lts

# Install Electron and related packages
cd camera-control
npm install

# Install dependencies for depthai general demo
cd ../depthai
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
