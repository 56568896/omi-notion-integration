# Free 24/7 Deployment Guide

## Railway.app Deployment (Recommended - 500 hours/month free)

### Step 1: Prepare Repository
```bash
cd omi-notion-integration

# Initialize git repo
git init
git add .
git commit -m "Initial commit: Omi AI → Notion integration"

# Push to GitHub (create repo first)
git remote add origin https://github.com/yourusername/omi-notion-integration.git
git push -u origin main
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your `omi-notion-integration` repository
5. Railway auto-detects Node.js and deploys

### Step 3: Configure Environment Variables
In Railway dashboard:
1. Go to your project → Variables tab
2. Add these variables:
   ```
   NOTION_API_KEY=secret_xxxxx
   NOTION_TASKS_DATABASE_ID=your_database_id
   NOTION_TITLE_PROPERTY=Name
   NOTION_STATUS_PROPERTY=Status
   NOTION_SOURCE_PROPERTY=Source
   NOTION_DATE_PROPERTY=Created Date
   NOTION_DEFAULT_STATUS=Not started
   ```

### Step 4: Get Your Webhook URL
1. In Railway dashboard → Deployments tab
2. Copy the generated URL (e.g., `https://your-app.railway.app`)
3. Your webhook endpoint: `https://your-app.railway.app/omi-webhook`

### Step 5: Configure Omi AI
1. Omi AI app → Settings → Developer Mode
2. Set webhook URL: `https://your-app.railway.app/omi-webhook`

## Alternative: Render.com (750 hours/month free)

### Quick Deploy Button
1. Fork this repo on GitHub
2. Go to [render.com](https://render.com)
3. Connect GitHub repo
4. Choose "Web Service"
5. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Same as Railway

## Benefits of Cloud Deployment

✅ **24/7 Operation** - Never stops when you restart your Mac
✅ **Auto-restart** - Recovers from crashes automatically  
✅ **HTTPS** - Secure webhook endpoint
✅ **Monitoring** - Built-in health checks and logs
✅ **Zero Maintenance** - No manual restarts needed

## Custom Database Properties

When you share your specific Notion database structure, I can help you map the exact properties. For example:

```env
# If your database uses different property names:
NOTION_TITLE_PROPERTY=Task Name
NOTION_STATUS_PROPERTY=Progress
NOTION_SOURCE_PROPERTY=Origin
NOTION_DATE_PROPERTY=Date Added
NOTION_DEFAULT_STATUS=To Do

# Additional properties you might have:
NOTION_PRIORITY_PROPERTY=Priority
NOTION_PROJECT_PROPERTY=Project
NOTION_ASSIGNEE_PROPERTY=Assigned To
```

## Monitoring & Maintenance

### Health Check
- `https://your-app.railway.app/health` - Check if server is running

### Logs
- Railway/Render dashboards show real-time logs
- Monitor webhook processing and errors

### Updates
- Push to GitHub → Auto-deploys to Railway/Render
- Zero downtime deployments

**Result**: Your integration runs 24/7 without needing your Mac to be on!