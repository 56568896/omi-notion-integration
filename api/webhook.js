// Vercel serverless function for Omi AI → Notion integration
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

let mcpClient = null;

async function initializeMCP() {
  if (mcpClient) return mcpClient;
  
  try {
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@makenotion/notion-mcp-server'],
      env: {
        ...process.env,
        NOTION_API_KEY: process.env.NOTION_API_KEY
      }
    });
    
    mcpClient = new Client({
      name: "omi-notion-integration",
      version: "1.0.0"
    }, {
      capabilities: {}
    });

    await mcpClient.connect(transport);
    console.log('✅ Connected to Notion MCP server');
    return mcpClient;
  } catch (error) {
    console.error('❌ Failed to connect to MCP server:', error);
    throw error;
  }
}

async function addTaskToNotion(taskDescription, memory) {
  const client = await initializeMCP();
  
  // Get property mappings from environment variables (with defaults)
  const titleProperty = process.env.NOTION_TITLE_PROPERTY || 'Name';
  const statusProperty = process.env.NOTION_STATUS_PROPERTY || 'Status';
  const sourceProperty = process.env.NOTION_SOURCE_PROPERTY || 'Source';
  const dateProperty = process.env.NOTION_DATE_PROPERTY || 'Created Date';
  const defaultStatus = process.env.NOTION_DEFAULT_STATUS || 'Not started';
  
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
  
  // Status property (if exists)
  if (statusProperty) {
    properties[statusProperty] = {
      select: {
        name: defaultStatus
      }
    };
  }
  
  // Source property (if exists) 
  if (sourceProperty) {
    properties[sourceProperty] = {
      rich_text: [
        {
          text: {
            content: `From Omi AI: ${memory.structured?.title || 'Untitled conversation'}`
          }
        }
      ]
    };
  }
  
  // Date property (if exists)
  if (dateProperty) {
    properties[dateProperty] = {
      date: {
        start: memory.created_at
      }
    };
  }
  
  // Create a new page in the Tasks database
  const result = await client.callTool({
    name: 'create_page',
    arguments: {
      parent: {
        type: 'database_id',
        database_id: process.env.NOTION_TASKS_DATABASE_ID
      },
      properties: properties
    }
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
    
    // Extract action items
    const actionItems = memory.structured?.action_items || [];
    
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
        } catch (error) {
          console.error(`Failed to add task "${item.description}":`, error);
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