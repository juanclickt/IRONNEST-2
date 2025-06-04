import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const { username, password } = JSON.parse(event.body || '{}');
      
      // Simple admin authentication
      if (username === 'Admin' && password === 'IronNest2025') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Login successful',
            user: { username: 'Admin', role: 'admin' }
          }),
        };
      }
      
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials'
        }),
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid request body'
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};

export { handler };