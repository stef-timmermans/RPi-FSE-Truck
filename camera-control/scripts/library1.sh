#!/bin/bash

# Calls on the DepthAI test program

# Set the script's directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Construct the path to depthai
DEPTHAI_DIR="$SCRIPT_DIR/../../depthai"

# Navigate to depthai (if it exists)
cd "$DEPTHAI_DIR" || exit 1

# Run the application in the background
python depthai_demo.py &
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
