const express = require('express');
const path = require('path');
const app = express();
const PORT = 80;

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// Serve static files from 'node_modules'
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
