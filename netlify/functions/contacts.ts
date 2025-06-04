import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // For admin dashboard - return sample data since we're using localStorage
      const sampleContacts = [
        {
          id: 1,
          name: "David Miller",
          email: "david.miller@outlook.com",
          phone: "+27 81 999 1234",
          subject: "Studio Gym Setup Inquiry",
          message: "Hello! I run a personal training studio and need to upgrade our equipment.",
          createdAt: "2025-06-03T10:00:00.000Z"
        },
        {
          id: 2,
          name: "Emma Wilson", 
          email: "emma.wilson@gmail.com",
          phone: "+27 82 765 4321",
          subject: "Home Gym Equipment Question",
          message: "Hi there! I saw your work online and I am impressed.",
          createdAt: "2025-06-03T11:00:00.000Z"
        }
      ];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(sampleContacts),
      };
    }

    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body || '{}');
      
      if (!data.name || !data.email || !data.subject || !data.message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Contact submitted successfully',
          data: {
            ...data,
            id: Date.now(),
            createdAt: new Date().toISOString()
          }
        }),
      };
    }

    if (event.httpMethod === 'DELETE') {
      const contactId = event.path.split('/').pop();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Contact deleted successfully'
        }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };