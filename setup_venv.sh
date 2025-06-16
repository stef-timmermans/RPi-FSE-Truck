#!/bin/bash

# Exit script on any command failure
set -e

# Ensure DepthAI default programs exist
cd depthai
cd ..

# Ensure DepthAI Experiments programs exist
cd depthai-experiments
cd ..

# Create the Python virtual environment for the frontend
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

# Create separate Python virtual environments for each module
cd ..
deactivate
python3 -m venv demo-env
python3 -m venv emotion-env
python3 -m venv age-gender-env
# python3 -m venv people-env

# Install dependencies for depthai general demo
source demo-env/bin/activate
python3 -m pip install -r depthai/requirements.txt
deactivate

# Install dependencies for gen2-emotion-recognition
source emotion-env/bin/activate
python3 -m pip install -r depthai-experiments/gen2-emotion-recognition/requirements.txt
deactivate

# Install dependencies for gen2-age-gender
source people-env/bin/activate
python3 -m pip install -r depthai-experiments/gen2-age-gender/requirements.txt
deactivate