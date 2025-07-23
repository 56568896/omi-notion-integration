# Omi AI → Notion Tasks Integration Setup

## Prerequisites
- Node.js 18+ installed
- Notion account
- Omi AI app with developer mode access

## Setup Steps

### 1. Notion Setup
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name: "Omi Tasks Integration"
4. Select your workspace
5. Set capabilities: "Insert content", "Read content"
6. Copy the "Internal Integration Token"

### 2. Database Setup
1. Create or use existing "Tasks" database in Notion
2. Ensure these properties exist:
   - **Name** (Title)
   - **Status** (Select: Not started, In progress, Done)
   - **Source** (Text)
   - **Created Date** (Date)
3. Share database with your integration:
   - Click "..." → "Add connections" → Select your integration

### 3. Get Database ID
1. Open your Tasks database in Notion
2. Copy URL: `https://notion.so/workspace/DATABASE_ID?v=...`
3. Extract the DATABASE_ID (32 character string)

### 4. Local Setup
```bash
# Clone/download the integration files
cd omi-notion-integration

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values:
# NOTION_API_KEY=secret_xxxxx
# NOTION_TASKS_DATABASE_ID=xxxxx
```

### 5. Test Local Server
```bash
# Start development server
npm run dev

# Test health endpoint
curl http://localhost:3000/health
```

### 6. Omi AI Configuration
1. Open Omi AI app
2. Go to Settings → Developer Mode
3. Enable developer mode
4. Set webhook URL: `http://your-server:3000/omi-webhook`

### 7. Production Deployment (Free Options)

#### Option A: Railway.app
1. Connect GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically

#### Option B: Render.com
1. Connect GitHub repo to Render
2. Add environment variables
3. Deploy as web service

#### Option C: Vercel (with serverless functions)
1. Convert to serverless function
2. Deploy to Vercel
3. Use Vercel environment variables

## Usage
1. Have conversations with Omi AI
2. Mention tasks/action items naturally
3. Wait for memory processing
4. Check your Notion Tasks database for new entries

## Troubleshooting
- Check server logs for connection issues
- Verify Notion integration permissions
- Test webhook with existing Omi memories
- Ensure database is shared with integration

## Testing
Use Omi's developer tools to trigger webhook with existing memories containing action items.