import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, htmlContent, textContent } = req.body;

    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({ error: 'Brevo API key not configured' });
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
        textContent: textContent || ''
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', response.status, errorData);
      return res.status(500).json({ 
        error: 'Failed to send email', 
        details: errorData,
        status: response.status 
      });
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    console.log('Email details - To:', to, 'Subject:', subject);
    return res.status(200).json({ success: true, messageId: result.messageId, result });

  } catch (error) {
    console.error('Email service error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}