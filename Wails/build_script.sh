#!/bin/bash

# Ensure we are in the correct directory (optional safety check)
if [ ! -d "frontend" ]; then
    echo "Error: 'frontend' directory not found. Please run this from the Wails root."
    exit 1
fi

echo "Scanning for available frameworks..."

# 1. Enumerate sibling directories (../), max depth 1, exclude 'Wails' and hidden folders
# We use a while loop to safely populate the array even with spaces in names
options=()
while IFS= read -r -d $'\0' dir; do
    dirname=$(basename "$dir")
    # Exclude 'Wails' and the parent directory itself
    if [ "$dirname" != "Wails" ] && [ "$dirname" != ".." ]; then
        options+=("$dirname")
    fi
done < <(find .. -maxdepth 1 -mindepth 1 -type d -not -path '*/.*' -print0)

# Check if we found anything
if [ ${#options[@]} -eq 0 ]; then
    echo "No other framework folders found in ../"
    exit 1
fi

# 2. TUI Selector (Simple Menu)
echo "------------------------------------------------"
echo " Select a framework to mount into Wails:"
echo "------------------------------------------------"

PS3="Enter number: "
select opt in "${options[@]}"; do
    if [ -n "$opt" ]; then
        echo "------------------------------------------------"
        echo "Selected: $opt"
        
        # 3. Safety Confirmation
        read -p "This will wipe './frontend' and replace it with '../$opt'. Continue? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Cancelled."
            exit 1
        fi
        
        # 4. The "Hot Swap" Operation
        echo "Cleaning ./frontend..."
        # Remove old files but keep the folder
        rm -rf frontend/*
        # Also remove hidden files if necessary, but keep the dir structure safe
        find frontend -mindepth 1 -delete 

        echo "Copying from ../$opt..."
        # Copy content of selected folder INTO frontend
        # We exclude node_modules to keep the copy fast and clean (let Wails install fresh if needed)
        # We also exclude .git directories
        rsync -av --progress "../$opt/" "frontend/" \
            --exclude node_modules \
            --exclude .git \
            --exclude .svelte-kit \
            --exclude dist \
            --exclude build

        echo "------------------------------------------------"
        echo "Success! '$opt' is now the active Wails frontend."
        echo "Don't forget to run 'wails dev' to reinstall dependencies if needed."

        # 5. Build the application
        echo "------------------------------------------------"
        echo "Building the application..."

        PLATFORM=windows PRODUCTION=false wails3 task build
        break
    else
        echo "Invalid selection. Try again."
    fi
done