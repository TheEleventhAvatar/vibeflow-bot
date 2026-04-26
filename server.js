const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// VibeFlow MCP client
class VibeFlowMCPClient {
  constructor() {
    this.apiUrl = process.env.VIBEFLOW_MCP_URL || 'https://tool.vibeflow.ai/mcp';
    this.apiKey = process.env.VIBEFLOW_API_KEY;
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async callTool(toolName, params = {}) {
    try {
      const response = await axios.post(this.apiUrl, {
        jsonrpc: "2.0",
        id: uuidv4(),
        method: "tools/call",
        params: {
          name: toolName,
          arguments: params
        }
      }, { headers: this.headers });

      return response.data;
    } catch (error) {
      console.error(`Error calling ${toolName}:`, error.response?.data || error.message);
      throw error;
    }
  }

  async initiateProject(prompt, designSystemId = null) {
    return this.callTool('initiate_project', { prompt, designSystemId });
  }

  async getProject(projectId) {
    return this.callTool('get_project', { projectId });
  }

  async openProjectForEditing(projectId) {
    return this.callTool('open_project_for_editing', { projectId });
  }

  async getAllDesignSystems() {
    return this.callTool('get_all_design_systems');
  }

  async createDesignSystem(name, description = '') {
    return this.callTool('create_design_system', { name, description });
  }
}

const vibeflowClient = new VibeFlowMCPClient();

// Message history
const messageHistory = [];

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send message history to new client
  socket.emit('message_history', messageHistory);

  socket.on('send_message', async (data) => {
    const { message, type = 'user' } = data;
    const messageObj = {
      id: uuidv4(),
      text: message,
      type: type,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    // Add to history and broadcast
    messageHistory.push(messageObj);
    io.emit('new_message', messageObj);

    try {
      // Process the message with VibeFlow
      const response = await processMessage(message);
      
      // Update message status
      messageObj.status = 'sent';
      messageObj.response = response;
      io.emit('message_update', messageObj);

      // Add bot response
      const botMessage = {
        id: uuidv4(),
        text: response.text,
        type: 'bot',
        timestamp: new Date().toISOString(),
        status: 'sent',
        metadata: response.metadata
      };

      messageHistory.push(botMessage);
      io.emit('new_message', botMessage);

    } catch (error) {
      messageObj.status = 'error';
      messageObj.error = error.message;
      io.emit('message_update', messageObj);

      // Add error message
      const errorMessage = {
        id: uuidv4(),
        text: `Sorry, I encountered an error: ${error.message}`,
        type: 'bot',
        timestamp: new Date().toISOString(),
        status: 'error'
      };

      messageHistory.push(errorMessage);
      io.emit('new_message', errorMessage);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Message processing logic
async function processMessage(message) {
  const lowerMessage = message.toLowerCase().trim();

  // Help command
  if (lowerMessage.includes('help') || lowerMessage === '!help') {
    return {
      text: `🤖 **VibeFlow Bot Commands:**

**Project Management:**
• \`create [project description]\` - Start a new VibeFlow project
• \`status [project-id]\` - Check project build status
• \`open [project-id]\` - Open project in editor

**Design Systems:**
• \`design systems\` - List available design systems
• \`create design [name]\` - Create new design system

**Other:**
• \`help\` - Show this help message
• \`about\` - About VibeFlow Bot

Just type naturally, and I'll help you build with VibeFlow! 🚀`,
      metadata: { type: 'help' }
    };
  }

  // About command
  if (lowerMessage.includes('about')) {
    return {
      text: `🌊 **VibeFlow Bot** 

I'm your AI assistant for building projects with VibeFlow! I can help you:
- Create and manage VibeFlow projects
- Work with design systems
- Monitor build progress
- Access project editors

Powered by VibeFlow MCP server for seamless AI-driven development.`,
      metadata: { type: 'about' }
    };
  }

  // Design systems command
  if (lowerMessage.includes('design system') || lowerMessage.includes('design systems')) {
    try {
      const result = await vibeflowClient.getAllDesignSystems();
      const designSystems = result.result?.content || [];
      
      if (designSystems.length === 0) {
        return {
          text: `📦 **Design Systems**

No design systems found. Create one with: \`create design [name]\``,
          metadata: { type: 'design_systems', count: 0 }
        };
      }

      const systemsList = designSystems.map(ds => `• ${ds.name}`).join('\n');
      return {
        text: `📦 **Design Systems** (${designSystems.length})

${systemsList}`,
        metadata: { type: 'design_systems', count: designSystems.length, systems: designSystems }
      };
    } catch (error) {
      throw new Error('Failed to fetch design systems');
    }
  }

  // Create design system
  if (lowerMessage.startsWith('create design')) {
    const name = message.replace(/^create design\s*/i, '').trim();
    if (!name) {
      return {
        text: `❌ Please provide a name for the design system.

Usage: \`create design [name]\``,
        metadata: { type: 'error' }
      };
    }

    try {
      const result = await vibeflowClient.createDesignSystem(name, `Design system created via bot`);
      return {
        text: `✅ **Design System Created**

Name: ${name}
Status: Ready to use for projects! 🎨`,
        metadata: { type: 'design_system_created', name }
      };
    } catch (error) {
      throw new Error('Failed to create design system');
    }
  }

  // Create project
  if (lowerMessage.startsWith('create') && !lowerMessage.includes('design')) {
    const prompt = message.replace(/^create\s*/i, '').trim();
    if (!prompt) {
      return {
        text: `❌ Please provide a project description.

Usage: \`create [project description]\`

Example: \`create a todo app with user authentication\``,
        metadata: { type: 'error' }
      };
    }

    try {
      const result = await vibeflowClient.initiateProject(prompt);
      const projectId = result.result?.content?.projectId;
      
      if (!projectId) {
        throw new Error('No project ID returned');
      }

      return {
        text: `🚀 **Project Started**

Project ID: \`${projectId}\`
Description: ${prompt}
Status: Building... ⏳

Use \`status ${projectId}\` to check progress.`,
        metadata: { type: 'project_created', projectId, prompt }
      };
    } catch (error) {
      throw new Error('Failed to start project');
    }
  }

  // Status check
  if (lowerMessage.startsWith('status')) {
    const projectId = message.replace(/^status\s*/i, '').trim();
    if (!projectId) {
      return {
        text: `❌ Please provide a project ID.

Usage: \`status [project-id]\``,
        metadata: { type: 'error' }
      };
    }

    try {
      const result = await vibeflowClient.getProject(projectId);
      const project = result.result?.content;
      
      if (!project) {
        return {
          text: `❌ Project not found: ${projectId}`,
          metadata: { type: 'error' }
        };
      }

      const status = project.status || 'unknown';
      const statusEmoji = status === 'ready' ? '✅' : status === 'building' ? '⏳' : '❌';
      
      return {
        text: `${statusEmoji} **Project Status**

ID: \`${projectId}\`
Status: ${project.status}
${project.description ? `Description: ${project.description}` : ''}
${project.url ? `URL: ${project.url}` : ''}`,
        metadata: { type: 'project_status', projectId, status: project.status }
      };
    } catch (error) {
      throw new Error('Failed to get project status');
    }
  }

  // Open project
  if (lowerMessage.startsWith('open')) {
    const projectId = message.replace(/^open\s*/i, '').trim();
    if (!projectId) {
      return {
        text: `❌ Please provide a project ID.

Usage: \`open [project-id]\``,
        metadata: { type: 'error' }
      };
    }

    try {
      const result = await vibeflowClient.openProjectForEditing(projectId);
      const editorUrl = result.result?.content?.url;
      
      if (!editorUrl) {
        return {
          text: `❌ Could not open project. Make sure the project is ready.`,
          metadata: { type: 'error' }
        };
      }

      return {
        text: `🔗 **Project Editor**

Project ID: \`${projectId}\`
Editor URL: ${editorUrl}

Click the link to open your project in the VibeFlow editor! ✨`,
        metadata: { type: 'project_opened', projectId, url: editorUrl }
      };
    } catch (error) {
      throw new Error('Failed to open project');
    }
  }

  // Default response for unrecognized commands
  return {
    text: `🤔 I'm not sure how to handle that. Try \`help\` to see available commands, or just describe what you want to build!

Examples:
• \`create a weather app\`
• \`create design modern\`
• \`status abc123\``,
    metadata: { type: 'unknown_command' }
  };
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🤖 VibeFlow Bot server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
  
  if (!process.env.VIBEFLOW_API_KEY || process.env.VIBEFLOW_API_KEY === 'demo_key_please_replace_with_real_key') {
    console.log('⚠️  Warning: Using demo API key. Set a real VIBEFLOW_API_KEY in .env file for full functionality');
  }
});
