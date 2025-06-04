import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
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
      const sampleBookings = [
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah.j@gmail.com",
          phone: "+27 83 555 7890",
          serviceType: "Home Gym Design",
          preferredDate: "2025-06-15",
          timeSlot: "10:00 AM",
          location: "Cape Town, Claremont",
          message: "Looking to convert my garage into a home gym. Space is about 30 square meters.",
          status: "pending",
          createdAt: "2025-06-03T10:00:00.000Z"
        },
        {
          id: 2,
          name: "Mike Thompson",
          email: "mike.thompson@email.com",
          phone: "+27 84 123 4567",
          serviceType: "Equipment Installation",
          preferredDate: "2025-06-20",
          timeSlot: "2:00 PM",
          location: "Stellenbosch",
          message: "Need help installing commercial-grade equipment for our new studio.",
          status: "confirmed",
          createdAt: "2025-06-03T11:00:00.000Z"
        }
      ];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(sampleBookings),
      };
    }

    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body || '{}');
      
      if (!data.name || !data.email || !data.phone || !data.serviceType) {
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
          message: 'Booking submitted successfully',
          data: {
            ...data,
            id: Date.now(),
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        }),
      };
    }

    if (event.httpMethod === 'PATCH') {
      const data = JSON.parse(event.body || '{}');
      const bookingId = event.path.split('/').pop();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Status updated successfully',
          data: { id: bookingId, ...data }
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