const express = require('express');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
require('dotenv').config();

const app = express();
app.use(express.json());

// MCP client setup for Notion
let mcpClient = null;

async function initializeMCP() {
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
    
    // List available tools
    const result = await mcpClient.listTools();
    console.log('Available tools:', result.tools.map(t => t.name));
  } catch (error) {
    console.error('❌ Failed to connect to MCP server:', error);
  }
}

// Webhook endpoint for Omi AI
app.post('/omi-webhook', async (req, res) => {
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
    
    // Process each action item
    for (const item of actionItems) {
      if (!item.completed) {
        await addTaskToNotion(item.description, memory);
      }
    }
    
    res.status(200).json({ 
      message: 'Success', 
      processed: actionItems.length 
    });
    
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function addTaskToNotion(taskDescription, memory) {
  if (!mcpClient) {
    console.error('MCP client not initialized');
    return;
  }
  
  try {
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
    const result = await mcpClient.callTool({
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
    
  } catch (error) {
    console.error('❌ Failed to add task to Notion:', error);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    mcpConnected: mcpClient !== null,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  await initializeMCP();
  
  app.listen(PORT, () => {
    console.log(`🚀 Omi-Notion integration server running on port ${PORT}`);
    console.log(`📡 Webhook endpoint: http://localhost:${PORT}/omi-webhook`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
}

startServer();