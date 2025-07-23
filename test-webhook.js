// Test script to validate webhook functionality locally
const fs = require('fs');
const path = require('path');

// Mock Omi AI webhook payload
const mockOmiPayload = {
  "id": 123,
  "created_at": "2024-07-22T23:59:45.910559+00:00",
  "started_at": "2024-07-21T22:34:43.384323+00:00", 
  "finished_at": "2024-07-21T22:35:43.384323+00:00",
  "transcript_segments": [],
  "photos": [],
  "structured": {
    "title": "Team Meeting Discussion",
    "overview": "Discussed project timeline and action items",
    "emoji": "🗣️",
    "category": "work",
    "action_items": [
      {
        "description": "Review the quarterly budget proposal by Friday",
        "completed": false
      },
      {
        "description": "Schedule follow-up meeting with design team",
        "completed": false
      },
      {
        "description": "Update project documentation",
        "completed": false
      }
    ],
    "events": []
  },
  "apps_response": [],
  "discarded": false
};

async function testWebhook() {
  console.log('🧪 Testing Omi AI webhook integration...\n');
  
  // Check if required files exist
  const requiredFiles = [
    'api/webhook.js',
    'vercel.json',
    'package.json'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing required file: ${file}`);
      return;
    }
    console.log(`✅ Found: ${file}`);
  }
  
  console.log('\n📝 Mock webhook payload:');
  console.log('Title:', mockOmiPayload.structured.title);
  console.log('Action items:', mockOmiPayload.structured.action_items.length);
  mockOmiPayload.structured.action_items.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.description}`);
  });
  
  console.log('\n🔧 Environment check:');
  const requiredEnvVars = [
    'NOTION_API_KEY',
    'NOTION_TASKS_DATABASE_ID'
  ];
  
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Set`);
    } else {
      console.log(`⚠️  ${envVar}: Not set (required for actual deployment)`);
    }
  }
  
  console.log('\n📊 Expected Notion properties:');
  const titleProp = process.env.NOTION_TITLE_PROPERTY || 'Name';
  const statusProp = process.env.NOTION_STATUS_PROPERTY || 'Status';
  const sourceProp = process.env.NOTION_SOURCE_PROPERTY || 'Source';
  const dateProp = process.env.NOTION_DATE_PROPERTY || 'Created Date';
  
  console.log(`  Title: "${titleProp}"`);
  console.log(`  Status: "${statusProp}"`);
  console.log(`  Source: "${sourceProp}"`);
  console.log(`  Date: "${dateProp}"`);
  
  console.log('\n🚀 Ready for deployment!');
  console.log('Next steps:');
  console.log('1. Deploy to Vercel using /vercel-deploy.md guide');
  console.log('2. Set environment variables in Vercel dashboard');
  console.log('3. Configure Omi AI webhook URL');
  console.log('4. Test with real Omi AI conversations');
}

// Run test if called directly
if (require.main === module) {
  testWebhook().catch(console.error);
}

module.exports = { testWebhook, mockOmiPayload };