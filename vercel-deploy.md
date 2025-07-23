# Vercel Deployment Guide - Free Forever! 🎉

## Why Vercel is Perfect for This:
- **Truly unlimited** - only runs when Omi AI sends webhooks (seconds per month)
- **No hour limits** - free tier handles 100GB-hours (you'll use ~0.01%)
- **Instant scaling** - handles any number of webhooks
- **Free forever** - designed for exactly this use case

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/omi-notion-integration&env=NOTION_API_KEY,NOTION_TASKS_DATABASE_ID&envDescription=Notion%20integration%20credentials&envLink=https://developers.notion.com/docs/create-a-notion-integration)

## Manual Setup

### Step 1: Prerequisites
1. [Get Notion API key](https://www.notion.so/my-integrations) 
2. Create/share your Tasks database with the integration
3. Copy your database ID from the URL

### Step 2: Deploy to Vercel
```bash
# Option A: Git deployment (recommended)
git init
git add .
git commit -m "Omi AI → Notion integration"
git remote add origin https://github.com/yourusername/omi-notion-integration.git
git push -u origin main

# Then: Go to vercel.com → Import Git Repository
```

```bash
# Option B: Direct CLI deployment
npm i -g vercel
cd omi-notion-integration
vercel --prod
```

### Step 3: Configure Environment Variables
In Vercel dashboard → Settings → Environment Variables:

**Required:**
- `NOTION_API_KEY` = `secret_xxxxx` (from Notion integration)
- `NOTION_TASKS_DATABASE_ID` = `32-character database ID`

**Optional (customize for your database):**
- `NOTION_TITLE_PROPERTY` = `Name` (or your title column name)
- `NOTION_STATUS_PROPERTY` = `Status` (or your status column name)  
- `NOTION_SOURCE_PROPERTY` = `Source` (or your source column name)
- `NOTION_DATE_PROPERTY` = `Created Date` (or your date column name)
- `NOTION_DEFAULT_STATUS` = `Not started` (or your default status value)

### Step 4: Get Your Webhook URL
After deployment, your webhook endpoint will be:
```
https://your-project-name.vercel.app/api/webhook
```

### Step 5: Configure Omi AI
1. Omi AI app → Settings → Developer Mode
2. Set webhook URL: `https://your-project-name.vercel.app/api/webhook`

## Testing

### Health Check
Visit: `https://your-project-name.vercel.app/api/health`
Should return: `{"status": "healthy", ...}`

### Test Webhook
Use Omi's developer tools to trigger webhook with existing memories containing action items.

## Custom Database Properties

If your Notion database uses different property names, update the environment variables:

```bash
# Example: If your database has these columns:
# - "Task Name" (instead of "Name")  
# - "Progress" (instead of "Status")
# - "Origin" (instead of "Source")

NOTION_TITLE_PROPERTY=Task Name
NOTION_STATUS_PROPERTY=Progress  
NOTION_SOURCE_PROPERTY=Origin
NOTION_DEFAULT_STATUS=To Do
```

## Benefits vs Other Platforms

| Platform | Monthly Limit | Your Usage | Result |
|----------|---------------|------------|---------|
| **Vercel** | 100GB-hours | ~0.01GB-hours | ✅ **Free Forever** |
| Railway | 500 hours | 744 hours needed | ❌ 10 days downtime |
| Render | 750 hours | 744 hours needed | ⚠️ Tight fit |

## Monitoring

- **Vercel Dashboard**: Real-time function logs and metrics
- **Error Tracking**: Automatic error capture and alerting  
- **Performance**: Sub-second webhook processing
- **Uptime**: 99.99% availability SLA

## Troubleshooting

### Common Issues:
1. **"MCP client failed"** → Check NOTION_API_KEY is correct
2. **"Database not found"** → Verify NOTION_TASKS_DATABASE_ID and sharing
3. **"Property not found"** → Check property names match your database columns

### Debug Mode:
Check Vercel function logs in dashboard for detailed error messages.

**Result**: Your Omi AI → Notion integration runs unlimited, free forever! 🚀