export interface HandlerEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string>;
}

export interface HandlerContext {}

export interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

export type Handler = (event: HandlerEvent, context: HandlerContext) => Promise<HandlerResponse>;

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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { to, subject, htmlContent, textContent } = JSON.parse(event.body || '{}');

    if (!process.env.BREVO_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Brevo API key not configured' }),
      };
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'IronNest Installations',
          email: 'terblanche@ironnest.co.za'
        },
        to: [{ email: to }],
        subject,
        htmlContent,
        textContent: textContent || subject
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to send email' }),
      };
    }

    const result = await response.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, messageId: result.messageId }),
    };

  } catch (error) {
    console.error('Email service error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };