# Railway Deployment Guide for VibeFlow MCP Chat Bot

## 🚀 Quick Start (5 minutes)

### Prerequisites
- GitHub account
- Railway account (free)
- Your VibeFlow API key

### Step 1: Push to GitHub
```bash
# If not already on GitHub
git add .
git commit -m "Ready for Railway deployment"
git branch -M main
git remote add origin https://github.com/yourusername/vibeflow-bot.git
git push -u origin main
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select your `vibeflow-bot` repository
4. Railway will auto-detect Node.js project

### Step 3: Configure Environment Variables
1. In Railway dashboard, go to your project
2. Click "Variables" tab
3. Add these variables:
   ```
   VIBEFLOW_API_KEY=your_vibeflow_api_key_here
   NODE_ENV=production
   PORT=3000
   ```

### Step 4: Deploy!
- Railway will automatically build and deploy
- Your bot will be live at `https://your-project-name.railway.app`

---

## 📋 Detailed Instructions

### 1. Repository Setup

Make sure your repository has:
- ✅ `package.json` with start script
- ✅ `deploy.js` (production server)
- ✅ `.env.example` (environment template)
- ✅ `railway.json` (Railway configuration)

### 2. Railway Configuration

Your `railway.json` file is pre-configured for optimal deployment:
- Uses Nixpacks for building
- Runs `npm run deploy` on start
- Health check at `/health`
- Auto-restart on failure

### 3. Environment Variables

Critical variables for Railway:
```env
VIBEFLOW_API_KEY=your_vibeflow_api_key_here
NODE_ENV=production
PORT=3000
```

### 4. Deployment Process

Railway automatically:
1. 📦 Installs dependencies (`npm ci --production`)
2. 🔨 Builds your application
3. 🚀 Starts server with `npm run deploy`
4. 🏥 Runs health checks
5. 🌐 Provides HTTPS URL

---

## 🔧 Troubleshooting

### Common Issues

**Build Failed:**
- Check `package.json` has correct scripts
- Ensure all dependencies are in package.json
- Check Railway build logs

**API Key Error:**
- Verify `VIBEFLOW_API_KEY` is set in Variables
- Check key is valid in VibeFlow dashboard
- Restart deployment after adding variables

**Health Check Failed:**
- Ensure `/health` endpoint is working
- Check server is listening on PORT 3000
- Review Railway logs

**MCP Connection Issues:**
- Verify VibeFlow API key
- Check network connectivity
- Review MCP server status

### Debug Commands

```bash
# Check Railway logs
railway logs

# Restart deployment
railway restart

# Check environment variables
railway variables list
```

---

## 🎯 Best Practices

### 1. Environment Management
- Never commit API keys to git
- Use Railway's Variables tab for secrets
- Test variables locally first

### 2. Performance
- Railway automatically scales
- Monitor usage in dashboard
- Set up alerts for high traffic

### 3. Security
- Keep dependencies updated
- Monitor API usage
- Use HTTPS (automatic on Railway)

### 4. Monitoring
- Check health endpoint: `your-app.railway.app/health`
- Monitor Railway dashboard
- Set up error tracking

---

## 📊 Cost Management

### Free Tier Benefits
- $5/month credit
- Usually sufficient for development/light use
- Pay only for actual usage

### Usage Monitoring
- Railway dashboard shows usage
- Track API calls to VibeFlow
- Monitor active users

### Cost Optimization
- Use Railway's sleep mode for dev
- Monitor and optimize API calls
- Scale based on actual needs

---

## 🔄 Continuous Deployment

### Automatic Deployments
- Push to main branch → Auto-deploy
- Railway builds and deploys automatically
- Zero-downtime deployments

### Branch Deployments
- Create preview environments
- Test changes before merging
- Rollback if issues

### Environment-Specific Configs
- Use different variables per environment
- Separate dev/staging/production
- Test thoroughly in each environment

---

## 📞 Support

### Railway Support
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- In-app chat support

### VibeFlow Support
- VibeFlow documentation
- MCP API documentation
- Community forums

---

## 🎉 Success Checklist

- [ ] Repository pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Health check passing
- [ ] MCP tools working
- [ ] Bot accessible via public URL
- [ ] Monitoring configured

Your VibeFlow MCP Chat Bot is now live on Railway! 🚀
