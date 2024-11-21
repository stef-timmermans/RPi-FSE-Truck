#!/bin/bash

# This can be called by the main app to ensure that the SIGINT 
# signal correctly terminates the child process

# Set the current work directory to be the effective work
# directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Run dummy.js using Node.js with its full path
node "$SCRIPT_DIR/dummy.js"
