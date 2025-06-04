#!/bin/bash

# Build the frontend
npm run build

# Copy API functions to the build directory for static hosting
mkdir -p dist/public/api
cp -r api/* dist/public/api/

# Create a simple server.js for Node.js hosting
cat > dist/server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Import API routes
const contacts = require('./public/api/contacts');
const bookings = require('./public/api/bookings');

app.use('/api/contacts', contacts);
app.use('/api/bookings', bookings);

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

echo "Build complete. Ready for deployment."
EOF