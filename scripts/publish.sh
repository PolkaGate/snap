#!/bin/bash

# Step 1: Install dependencies
yarn

# Step 2: Build your package
yarn build

# Step 3: Navigate to the snap package directory
cd packages/snap/

# Step 4: Update the version in the snap package json
# $1: patch | minor | major (passed as an argument)
npm version "$1"

# Step 4-1: Apply version in snap,manifest,json and update the shasum
yarn
yarn build

# Step 5: Publish your package to NPM
# Use the --auth-type=web flag to authenticate
npm publish --auth-type=web
