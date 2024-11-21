#!/bin/bash

# Calls on the DepthAI Experiment:
# gen2-emotion-recognition

# Set the script's directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Construct the path to depthai-experiments
DEPTHAI_EXP_DIR="$SCRIPT_DIR/../../depthai-experiments"

# Navigate to depthai-experiments (if it exists)
cd "$DEPTHAI_EXP_DIR" || exit 1

# Naviage to the emotion recognition directory
cd gen2-emotion-recognition

# Run the application
python main.py
