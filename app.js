const http = require('http');

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

// Define the port number
const port = process.env.PORT || 3000;

// Start the server
server.listen
