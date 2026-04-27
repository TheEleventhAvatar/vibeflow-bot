const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from public directory
app.use(express.static('public'));

// Serve MCP Chat Interface
app.get('/mcp-chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mcp-chat-fixed.html'));
});

app.get('/debug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mcp-chat-fixed.html'));
});

app.get('/', (req, res) => {
  res.redirect('/debug');
});

app.listen(PORT, () => {
  console.log(`🤖 VibeFlow MCP Chat server running on port ${PORT}`);
  console.log(`📱 Chat interface available at http://localhost:${PORT}`);
});
