#!/bin/bash

# Calls on the DepthAI test program

# Set the script's directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Construct the path to depthai
DEPTHAI_DIR="$SCRIPT_DIR/../../depthai"

# Navigate to depthai (if it exists)
cd "$DEPTHAI_DIR" || exit 1

# Run the application
python depthai_demo.py
