# Local Setup - No Additional Accounts Needed! 🏠

## Simple Local Solution with Ngrok

This setup runs on your Mac and uses ngrok (free) to create a public webhook URL without any additional accounts.

### Step 1: Install Dependencies
```bash
cd omi-notion-integration
npm install
```

### Step 2: Create Environment File
```bash
cp .env.example .env
```

Edit `.env` with your Notion credentials:
```bash
# Required
NOTION_API_KEY=secret_xxxxx
NOTION_TASKS_DATABASE_ID=your_database_id

# Optional - customize for your database
NOTION_TITLE_PROPERTY=Name
NOTION_STATUS_PROPERTY=Status
NOTION_SOURCE_PROPERTY=Source
NOTION_DATE_PROPERTY=Created Date
NOTION_DEFAULT_STATUS=Not started
```

### Step 3: Get Notion Credentials

#### Create Notion Integration:
1. Go to [notion.so/my-integrations](https://notion.so/my-integrations)
2. Click "New integration"
3. Name: "Omi Tasks Integration"  
4. Capabilities: "Insert content", "Read content"
5. Copy the "Internal Integration Token" → This is your `NOTION_API_KEY`

#### Get Database ID:
1. Open your Tasks database in Notion
2. Copy the URL: `https://notion.so/workspace/DATABASE_ID?v=...`
3. Extract the 32-character `DATABASE_ID`

### Step 4: Start Local Server
```bash
# Terminal 1: Start the webhook server
npm start
```

Server runs on: `http://localhost:3000`

### Step 5: Create Public Tunnel with Ngrok
```bash
# Terminal 2: Create public tunnel (free, no account needed)
ngrok http 3000
```

You'll see output like:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

Copy the `https://abc123.ngrok.io` URL.

### Step 6: Configure Omi AI
1. Omi AI app → Settings → Developer Mode
2. Enable developer mode
3. Set webhook URL: `https://abc123.ngrok.io/omi-webhook`

### Step 7: Test It!
1. Have a conversation with Omi AI mentioning tasks
2. Example: "I need to call the dentist tomorrow and finish the quarterly report"
3. Check your Notion Tasks database for new entries!

## Benefits of This Setup:
✅ **No additional accounts** - just Notion integration (required anyway)
✅ **Free forever** - ngrok free tier is sufficient
✅ **Simple** - just 2 terminals running
✅ **Instant** - works immediately

## Limitations:
⚠️ **Mac must be on** - stops when you turn off/sleep your computer
⚠️ **Ngrok URL changes** - need to update Omi AI when you restart ngrok
⚠️ **Manual restarts** - if Mac restarts, you need to run the commands again

## Making It Persistent:
For 24/7 operation without your Mac being on, use the Vercel deployment instead (see `vercel-deploy.md`).

## Troubleshooting:
- **"MCP client failed"** → Check NOTION_API_KEY
- **"Database not found"** → Verify database ID and sharing with integration
- **"Webhook timeout"** → Check ngrok tunnel is active
- **"No action items"** → Mention tasks clearly in Omi conversations

**Ready to test!** 🚀