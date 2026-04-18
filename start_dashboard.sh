#!/bin/bash

echo "Starting Traffic Speed Analyser Dashboard..."
echo

cd dashboard

echo "Installing dependencies..."
npm install

echo
echo "Starting development server..."
echo "Dashboard will be available at http://localhost:3000"
echo

npm start