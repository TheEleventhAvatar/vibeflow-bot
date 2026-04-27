# VibeFlow MCP Chat Bot Deployment Guide

## Quick Start

### Local Deployment
```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your VibeFlow API key

# Start the bot
npm run deploy
```

### Docker Deployment
```bash
# Build and run with Docker
npm run docker:build
npm run docker:run

# Or use Docker Compose (recommended for production)
npm run docker:compose
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Required
VIBEFLOW_API_KEY=your_vibeflow_api_key_here

# Optional
NODE_ENV=production
PORT=3000
```

## Deployment Options

### 1. Docker (Recommended)
```bash
# Build the image
docker build -t vibeflow-mcp-chat .

# Run the container
docker run -p 3000:3000 \
  -e VIBEFLOW_API_KEY=your_key_here \
  vibeflow-mcp-chat

# Or use docker-compose
docker-compose up -d
```

### 2. Direct Node.js
```bash
# Install dependencies
npm install --production

# Set environment variables
export VIBEFLOW_API_KEY=your_key_here
export PORT=3000

# Start the application
node deploy.js
```

### 3. Cloud Deployment

#### Heroku
```bash
# Install Heroku CLI
# Create app
heroku create your-app-name

# Set environment variables
heroku config:set VIBEFLOW_API_KEY=your_key_here

# Deploy
git push heroku main
```

#### Railway
```bash
# Install Railway CLI
# Login and deploy
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

#### Vercel
```bash
# Install Vercel CLI
# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

## Health Monitoring

The bot includes a health check endpoint:
- `GET /health` - Returns service status

## Production Checklist

- [ ] Set VIBEFLOW_API_KEY environment variable
- [ ] Configure PORT (default: 3000)
- [ ] Set up SSL/HTTPS for production
- [ ] Configure monitoring and logging
- [ ] Set up backup and recovery procedures
- [ ] Test all MCP tools functionality

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure VIBEFLOW_API_KEY is set correctly
   - Check API key validity in VibeFlow dashboard

2. **Port Conflicts**
   - Change PORT environment variable
   - Check if port is already in use

3. **Docker Issues**
   - Ensure Docker is running
   - Check container logs: `docker logs container_name`

### Logs

Check application logs for debugging:
```bash
# Docker
docker logs vibeflow-mcp-chat

# Direct deployment
# Logs are output to console
```

## Security Considerations

- Keep API keys secure and never commit to version control
- Use HTTPS in production
- Consider rate limiting for public deployments
- Monitor API usage and costs

## Scaling

For high-traffic deployments:
- Use load balancer (nginx included in docker-compose)
- Consider container orchestration (Kubernetes)
- Implement caching strategies
- Monitor resource usage

## Support

For issues with:
- VibeFlow MCP API: Check VibeFlow documentation
- Deployment: Review this guide and logs
- Bot functionality: Test MCP tools in chat interface
