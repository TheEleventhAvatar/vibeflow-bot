# 🤖 VibeFlow Bot

**VibeFlow Bot** is a real-time chat interface with Slack/Teams/iMessage-style UI that integrates with the [VibeFlow](https://vibeflow.ai) MCP (Model Context Protocol) server for AI-driven project generation and management.

## ✨ Features

- **Real-time chat** — Powered by Socket.IO with message history and status tracking
- **Project creation** — Start new VibeFlow projects directly from chat using natural language
- **Design system management** — List and create design systems
- **Project monitoring** — Check build status and open projects in the VibeFlow editor
- **Docker-ready** — Containerized with Docker and Docker Compose for easy deployment
- **Production deployment** — Pre-configured for Railway and other cloud platforms
- **Responsive UI** — Clean chat interface that works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- A [VibeFlow](https://vibeflow.ai) API key

### Installation

```bash
# Clone the repository
git clone https://github.com/TheEleventhAvatar/vibeflow-bot.git
cd vibeflow-bot

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Edit `.env` and set your VibeFlow API key:

```env
VIBEFLOW_API_KEY=your_actual_api_key_here
```

### Running Locally

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The chat interface will be available at **http://localhost:3000** (or port **3001** in dev mode).

## 🐳 Docker

```bash
# Build and run with Docker Compose
npm run docker:compose

# Or build and run manually
npm run docker:build
npm run docker:run

# Stop Docker services
npm run docker:stop
```

## ☁️ Cloud Deployment

This project is pre-configured for deployment on [Railway](https://railway.app). See [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) for detailed instructions, or consult [DEPLOYMENT.md](./DEPLOYMENT.md) for general deployment guidance.

## 💬 Chat Commands

| Command | Description | Example |
|---|---|---|
| `create [description]` | Start a new VibeFlow project | `create a todo app with auth` |
| `status [project-id]` | Check project build status | `status abc123` |
| `open [project-id]` | Open project in VibeFlow editor | `open abc123` |
| `design systems` | List available design systems | |
| `create design [name]` | Create a new design system | `create design modern` |
| `help` | Show all available commands | |
| `about` | About VibeFlow Bot | |

## 📁 Project Structure

```
vibeflow-bot/
├── public/                  # Static frontend assets
│   ├── index.html           # Main chat UI
│   ├── script.js            # Client-side Socket.IO logic
│   └── styles.css           # Chat interface styles
├── server.js                # Full Socket.IO chat server with MCP integration
├── server-simple.js         # Lightweight Express server (dev mode)
├── deploy.js                # Production deployment server
├── Dockerfile               # Docker image definition
├── docker-compose.yml       # Multi-service Docker setup (app + nginx)
├── nginx.conf               # Nginx reverse proxy config
├── railway.json             # Railway deployment config
├── .env.example             # Environment variable template
├── RAILWAY_DEPLOY.md        # Railway-specific deployment guide
├── DEPLOYMENT.md            # General deployment documentation
└── CLOUD_COMPARISON.md      # Cloud provider comparison
```

## ⚙️ Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VIBEFLOW_MCP_URL` | VibeFlow MCP server URL | `https://tool.vibeflow.ai/mcp` |
| `VIBEFLOW_API_KEY` | Your VibeFlow API key (required) | |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `production` |

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Containerization**: Docker, Nginx reverse proxy
- **Cloud**: Railway, Docker Compose
- **Integration**: [@vibeflowai/convex-mcp](https://www.npmjs.com/package/@vibeflowai/convex-mcp), Convex

## 📜 License

MIT