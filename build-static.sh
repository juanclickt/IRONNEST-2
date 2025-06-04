#!/bin/bash

echo "Building static site for Netlify deployment..."

# Install dependencies
npm install

# Build the client-side application
npx vite build

# Check if build succeeded
if [ -d "dist/public" ]; then
    echo "Build successful - files created in dist/public"
    ls -la dist/public/
else
    echo "Build failed - no dist/public directory found"
    exit 1
fi

echo "Static build complete and ready for Netlify deployment"