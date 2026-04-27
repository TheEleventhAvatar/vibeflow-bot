const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Serve MCP Chat Interface
app.get('/mcp-chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mcp-chat-complete.html'));
});

app.get('/debug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mcp-chat-complete.html'));
});

app.get('/', (req, res) => {
  res.redirect('/debug');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'vibeflow-mcp-chat-bot'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 VibeFlow MCP Chat Bot deployed successfully!`);
  console.log(`📱 Chat interface available at http://localhost:${PORT}`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  console.log(`🚀 Ready for production deployment`);
});
