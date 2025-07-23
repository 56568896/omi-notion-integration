# Omi AI → Notion Integration Setup Log

## What We Built
- **Free, serverless integration** that automatically creates Notion tasks from Omi AI conversations
- **24/7 operation** via Vercel deployment
- **Zero maintenance** required

## Architecture
```
Omi AI Conversations → Webhook → Vercel Function → Notion API → Tasks Database
```

## Key Components

### 1. Webhook Endpoint
- **URL**: `https://your-project.vercel.app/api/webhook`
- **Function**: `/api/webhook.js` - Processes Omi memory objects
- **Trigger**: Omi AI "Conversation Events" webhook

### 2. Database Mapping
Your Notion Tasks database structure:
- **Task name** (Title) - Maps to action item description
- **Status** (Status type) - Defaults to "To-do" 
- **When** (Select) - Defaults to "Today"
- **Project** (Select) - Left empty by default
- **Due date** (Date) - Left empty

### 3. Environment Variables (Vercel)
```
NOTION_API_KEY=ntn_xxxxx (your integration token)
NOTION_TASKS_DATABASE_ID=xxxxx (32-character ID)
NOTION_TITLE_PROPERTY=Task name
NOTION_STATUS_PROPERTY=Status (capital S - important!)
NOTION_SOURCE_PROPERTY=Project
NOTION_WHEN_PROPERTY=When
NOTION_DATE_PROPERTY=Due date
NOTION_DEFAULT_STATUS=To-do
NOTION_DEFAULT_WHEN=Today
```

## Key Learnings & Debugging Tips

### 1. Property Name Issues
- **Display names** vs **API names** can differ
- **Case sensitivity** matters (Status vs status)
- **Property types** affect format:
  - `status` type uses `{ status: { name: "To-do" } }`
  - `select` type uses `{ select: { name: "Today" } }`

### 2. Common Errors
- `"property does not exist"` → Check exact property names
- `"expected to be status"` → Check property type in schema
- `"MCP server not found"` → Use direct Notion API instead

### 3. Debugging Commands
```javascript
// Get database schema
const databaseInfo = await notion.databases.retrieve({
  database_id: process.env.NOTION_TASKS_DATABASE_ID
});
console.log('Database properties:', JSON.stringify(databaseInfo.properties, null, 2));
```

## Deployment Steps
1. **GitHub**: Code stored at `https://github.com/56568896/omi-notion-integration`
2. **Vercel**: Auto-deploys from GitHub main branch
3. **Omi AI**: Webhook configured in Developer Mode → Conversation Events

## File Structure
```
/api/webhook.js          # Main serverless function
/api/health.js           # Health check endpoint
/package.json            # Dependencies (@notionhq/client)
/vercel.json             # Deployment config
/.env.example            # Environment variables template
/vercel-deploy.md        # Deployment guide
/local-setup.md          # Local development setup
```

## Dependencies
- `@notionhq/client` - Official Notion API client
- `express` - Web framework (for local development)

## Security Notes
- ✅ API keys stored in Vercel environment variables
- ✅ HTTPS encryption for all data transmission
- ✅ Notion integration limited to specific database
- ⚠️ Webhook endpoint is public (but requires exact Omi format)

## Future Enhancements Ideas
- Smart project assignment based on conversation content
- Due date parsing from action item text
- Priority detection
- Multiple database support
- Error notifications

## Troubleshooting
1. **Check Vercel function logs** for errors
2. **Verify environment variables** in Vercel dashboard
3. **Test webhook** with Omi developer tools
4. **Confirm database sharing** with Notion integration

## Success Metrics
- ✅ Omi conversations with action items automatically create Notion tasks
- ✅ Zero manual intervention required
- ✅ Free forever operation on Vercel
- ✅ 24/7 availability independent of local machine

---
*Setup completed: July 23, 2025*  
*Integration working successfully* ✅