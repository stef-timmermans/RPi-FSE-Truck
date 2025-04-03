#!/bin/bash

# Calls on the DepthAI Experiment:
# gen2-people-counter

# Set the script's directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Construct the path to depthai-experiments
DEPTHAI_EXP_DIR="$SCRIPT_DIR/../../depthai-experiments"

# Navigate to depthai-experiments (if it exists)
cd "$DEPTHAI_EXP_DIR" || exit 1

# Naviage to the people counter directory
cd gen2-people-counter || exit 1

# Run the application in the background
python main.py &
PID=$!

# When this script is killed, also kill the Python child
trap "kill $PID 2>/dev/null" SIGINT SIGTERM

# Give the window a moment to appear
sleep 5

# Move the window to the HDMI display
# Replace "host" with `wmctrl -l` to find the window name
wmctrl -r "host" -e 0,800,0,-1,-1

# Wait until the child process finishes (aka wait forever)
wait $PID
