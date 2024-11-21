#!/bin/bash

# Calls on the DepthAI Experiment:
# <insert choice here>

# Set the script's directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Construct the path to depthai-experiments
DEPTHAI_DIR="$SCRIPT_DIR/../../depthai-experiments"

# Navigate to depthai-experiments (if it exists)
cd "$DEPTHAI_DIR" || exit 1

# Naviage to the specific library
# TODO
