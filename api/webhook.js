// Vercel serverless function for Omi AI → Notion integration
// Using Notion API directly instead of MCP

const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Send notification to Omi app
async function sendOmiNotification(message, uid) {
  if (!process.env.OMI_API_KEY || !uid) {
    console.log('Skipping notification - missing API key or UID');
    return;
  }

  try {
    const response = await fetch('https://based-hardware--plugins-api-plugins-api-send-notification.modal.run/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OMI_API_KEY}`
      },
      body: JSON.stringify({
        uid: uid,
        message: message
      })
    });

    if (response.ok) {
      console.log(`✅ Notification sent: "${message}"`);
    } else {
      console.error('Failed to send notification:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
}

async function addTaskToNotion(taskDescription, memory) {
  
  // First, let's get the database schema to see the actual property names
  try {
    const databaseInfo = await notion.databases.retrieve({
      database_id: process.env.NOTION_TASKS_DATABASE_ID
    });
    
    console.log('Database properties:', JSON.stringify(databaseInfo.properties, null, 2));
  } catch (error) {
    console.error('Failed to get database info:', error.message);
  }
  
  // Get property mappings from environment variables (customized for user's database)
  const titleProperty = process.env.NOTION_TITLE_PROPERTY || 'Task name';
  const statusProperty = process.env.NOTION_STATUS_PROPERTY || 'Status';
  const sourceProperty = process.env.NOTION_SOURCE_PROPERTY || 'Project';
  const dateProperty = process.env.NOTION_DATE_PROPERTY || 'Due date';
  const whenProperty = process.env.NOTION_WHEN_PROPERTY || 'When';
  const defaultStatus = process.env.NOTION_DEFAULT_STATUS || 'To-do';
  const defaultWhen = process.env.NOTION_DEFAULT_WHEN || 'Today';
  const defaultProject = process.env.NOTION_DEFAULT_PROJECT || null;
  
  console.log('Using property names:', {
    titleProperty,
    statusProperty,
    sourceProperty,
    dateProperty,
    whenProperty
  });
  
  // Build properties object dynamically
  const properties = {};
  
  // Title property (required)
  properties[titleProperty] = {
    title: [
      {
        text: {
          content: taskDescription
        }
      }
    ]
  };
  
  // Status property (if exists) - using correct format for Notion status type
  if (statusProperty) {
    properties[statusProperty] = {
      status: {
        name: defaultStatus
      }
    };
  }
  
  // When property (if exists)
  if (whenProperty) {
    properties[whenProperty] = {
      select: {
        name: defaultWhen
      }
    };
  }
  
  // Project property (if exists and default is specified) 
  if (sourceProperty && defaultProject) {
    properties[sourceProperty] = {
      select: {
        name: defaultProject
      }
    };
  }
  
  // Due date property (if exists) - leave empty, user can set manually
  // Note: Not auto-setting due date since Omi AI doesn't provide specific dates
  
  // Create a new page in the Tasks database using Notion API
  const result = await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: process.env.NOTION_TASKS_DATABASE_ID
    },
    properties: properties
  });
  
  console.log(`✅ Added task to Notion: "${taskDescription}"`);
  return result;
}

export default async function handler(req, res) {
  // Handle CORS for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const memory = req.body;
    const uid = req.query.uid;
    
    console.log(`📥 Received memory from user ${uid}:`, memory.structured?.title);
    
    // Debug: Log the full payload structure
    console.log('Full memory object:', JSON.stringify(memory, null, 2));
    
    // Extract action items
    const actionItems = memory.structured?.action_items || [];
    
    console.log('Action items found:', actionItems.length);
    console.log('Action items data:', JSON.stringify(actionItems, null, 2));
    
    if (actionItems.length === 0) {
      console.log('No action items found in this memory');
      return res.status(200).json({ message: 'No action items to process' });
    }
    
    console.log(`Found ${actionItems.length} action items`);
    
    // Process each incomplete action item
    const processedTasks = [];
    for (const item of actionItems) {
      if (!item.completed) {
        try {
          await addTaskToNotion(item.description, memory);
          processedTasks.push(item.description);
          
          // Send confirmation notification
          await sendOmiNotification(`✅ Task added: ${item.description}`, uid);
        } catch (error) {
          console.error(`Failed to add task "${item.description}":`, error.message);
          
          // Send error notification
          await sendOmiNotification(`❌ Failed to add task: ${item.description}`, uid);
          
          // If it's a validation error, let's get more details
          if (error.code === 'validation_error') {
            console.error('Full validation error:', error.body);
          }
        }
      }
    }
    
    res.status(200).json({ 
      message: 'Success', 
      processed: processedTasks.length,
      tasks: processedTasks
    });
    
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}