// Brevo email service integration
interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface BookingData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  budget?: string;
  preferredDate: string;
  timeSlot: string;
  location?: string;
  message?: string;
}

class EmailService {
  private async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const response = await fetch('/api/send_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      // If we get any response (even if not 200), try to parse it
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        return false;
      }

      if (response.ok) {
        console.log('Email sent successfully:', result);
        return true;
      } else {
        console.error('Email API error:', response.status, result);
        return false;
      }
    } catch (networkError) {
      console.error('Network error sending email:', networkError);
      return false;
    }
  }

  async sendContactNotification(contact: ContactFormData): Promise<boolean> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
          <div style="margin-bottom: 15px;">
            <div style="display: inline-block; padding: 10px 20px; border: 2px solid #7ED321; border-radius: 8px;">
              <span style="font-size: 24px; font-weight: bold; color: #7ED321;">🏠💪</span>
              <span style="margin-left: 10px; font-size: 18px; font-weight: bold; color: #fff;">IRONNEST</span>
            </div>
          </div>
          <h1 style="color: #7ED321; margin: 0;">IronNest Installations</h1>
          <h2 style="margin: 10px 0 0 0;">New Contact Form Submission</h2>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h3 style="color: #333; border-bottom: 2px solid #7ED321; padding-bottom: 10px;">Contact Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-weight: bold; width: 30%;">Name:</td>
              <td style="padding: 10px;">${contact.name}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;">${contact.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;">${contact.phone || 'Not provided'}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 10px; font-weight: bold;">Subject:</td>
              <td style="padding: 10px;">${contact.subject}</td>
            </tr>
          </table>
          
          <h3 style="color: #333; border-bottom: 2px solid #7ED321; padding-bottom: 10px; margin-top: 20px;">Message</h3>
          <div style="background: #fff; padding: 15px; border-left: 4px solid #7ED321; margin: 10px 0;">
            ${contact.message.replace(/\n/g, '<br>')}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 5px;">
            <p style="margin: 0; color: #333;"><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
          </div>
        </div>
        
        <div style="background: #333; color: #fff; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">IronNest Installations - Professional Gym Setup Services</p>
          <p style="margin: 5px 0 0 0;">Cape Town, South Africa | +27 760618310</p>
        </div>
      </div>
    `;

    const textContent = `
      IronNest Installations - New Contact Form Submission
      
      Contact Details:
      Name: ${contact.name}
      Email: ${contact.email}
      Phone: ${contact.phone || 'Not provided'}
      Subject: ${contact.subject}
      
      Message:
      ${contact.message}
      
      Please respond to this inquiry within 24 hours.
    `;

    // Send to business email only
    return await this.sendEmail({
      to: 'terblanche@ironnest.co.za',
      subject: `New Contact Form: ${contact.subject}`,
      htmlContent,
      textContent,
    });
  }

  async sendBookingNotification(booking: BookingData): Promise<boolean> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
          <div style="margin-bottom: 15px;">
            <div style="display: inline-block; padding: 10px 20px; border: 2px solid #7ED321; border-radius: 8px;">
              <span style="font-size: 24px; font-weight: bold; color: #7ED321;">🏠💪</span>
              <span style="margin-left: 10px; font-size: 18px; font-weight: bold; color: #fff;">IRONNEST</span>
            </div>
          </div>
          <h1 style="color: #7ED321; margin: 0;">IronNest Installations</h1>
          <h2 style="margin: 10px 0 0 0;">New Consultation Booking</h2>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h3 style="color: #333; border-bottom: 2px solid #7ED321; padding-bottom: 10px;">Client Information</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-weight: bold; width: 30%;">Name:</td>
              <td style="padding: 10px;">${booking.name}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;">${booking.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;">${booking.phone}</td>
            </tr>
          </table>
          
          <h3 style="color: #333; border-bottom: 2px solid #7ED321; padding-bottom: 10px; margin-top: 20px;">Booking Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f0f0f0;">
              <td style="padding: 10px; font-weight: bold; width: 30%;">Service Type:</td>
              <td style="padding: 10px;">${booking.serviceType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Preferred Date:</td>
              <td style="padding: 10px;">${booking.preferredDate}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 10px; font-weight: bold;">Time Slot:</td>
              <td style="padding: 10px;">${booking.timeSlot}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Location:</td>
              <td style="padding: 10px;">${booking.location || 'Not specified'}</td>
            </tr>
            ${booking.budget ? `
            <tr style="background: #f0f0f0;">
              <td style="padding: 10px; font-weight: bold;">Budget Range:</td>
              <td style="padding: 10px;">${booking.budget}</td>
            </tr>
            ` : ''}
          </table>
          
          ${booking.message ? `
          <h3 style="color: #333; border-bottom: 2px solid #7ED321; padding-bottom: 10px; margin-top: 20px;">Additional Message</h3>
          <div style="background: #fff; padding: 15px; border-left: 4px solid #7ED321; margin: 10px 0;">
            ${booking.message.replace(/\n/g, '<br>')}
          </div>
          ` : ''}
          
          <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404;"><strong>Action Required:</strong> Please confirm this consultation appointment within 24 hours.</p>
          </div>
        </div>
        
        <div style="background: #333; color: #fff; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">IronNest Installations - Professional Gym Setup Services</p>
          <p style="margin: 5px 0 0 0;">Cape Town, South Africa | +27 760618310</p>
        </div>
      </div>
    `;

    const textContent = `
      IronNest Installations - New Consultation Booking
      
      Client Information:
      Name: ${booking.name}
      Email: ${booking.email}
      Phone: ${booking.phone}
      
      Booking Details:
      Service Type: ${booking.serviceType}
      Preferred Date: ${booking.preferredDate}
      Time Slot: ${booking.timeSlot}
      Location: ${booking.location || 'Not specified'}
      ${booking.budget ? `Budget Range: ${booking.budget}` : ''}
      
      ${booking.message ? `Additional Message: ${booking.message}` : ''}
      
      Please confirm this consultation appointment within 24 hours.
    `;

    // Send to business email only
    return await this.sendEmail({
      to: 'terblanche@ironnest.co.za',
      subject: `New Consultation Booking - ${booking.serviceType}`,
      htmlContent,
      textContent,
    });
  }

  async sendConfirmationToClient(booking: BookingData): Promise<boolean> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
          <div style="margin-bottom: 15px;">
            <div style="display: inline-block; padding: 10px 20px; border: 2px solid #7ED321; border-radius: 8px;">
              <span style="font-size: 24px; font-weight: bold; color: #7ED321;">🏠💪</span>
              <span style="margin-left: 10px; font-size: 18px; font-weight: bold; color: #fff;">IRONNEST</span>
            </div>
          </div>
          <h1 style="color: #7ED321; margin: 0;">IronNest Installations</h1>
          <h2 style="margin: 10px 0 0 0;">Consultation Booking Confirmation</h2>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <p style="font-size: 16px; color: #333;">Dear ${booking.name},</p>
          
          <p style="color: #333;">Thank you for booking a consultation with IronNest Installations. We have received your request and will confirm the appointment details within 24 hours.</p>
          
          <h3 style="color: #333; border-bottom: 2px solid #7ED321; padding-bottom: 10px;">Your Booking Details</h3>
          
          <table style="width: 100%; border-collapse: collapse; background: #fff;">
            <tr>
              <td style="padding: 15px; font-weight: bold; width: 30%; border-bottom: 1px solid #eee;">Service Type:</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${booking.serviceType}</td>
            </tr>
            <tr>
              <td style="padding: 15px; font-weight: bold; border-bottom: 1px solid #eee;">Preferred Date:</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${booking.preferredDate}</td>
            </tr>
            <tr>
              <td style="padding: 15px; font-weight: bold; border-bottom: 1px solid #eee;">Time Slot:</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${booking.timeSlot}</td>
            </tr>
            <tr>
              <td style="padding: 15px; font-weight: bold;">Location:</td>
              <td style="padding: 15px;">${booking.location || 'To be discussed'}</td>
            </tr>
            ${booking.budget ? `
            <tr>
              <td style="padding: 15px; font-weight: bold; border-bottom: 1px solid #eee;">Budget Range:</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${booking.budget}</td>
            </tr>
            ` : ''}
          </table>
          
          <div style="margin: 20px 0; padding: 15px; background: #e8f5e8; border-radius: 5px; border-left: 4px solid #7ED321;">
            <h4 style="margin: 0 0 10px 0; color: #2d5016;">What happens next?</h4>
            <ul style="margin: 0; padding-left: 20px; color: #2d5016;">
              <li>We'll review your booking request</li>
              <li>Confirm availability for your preferred date and time</li>
              <li>Send you a detailed confirmation with our consultant's contact details</li>
              <li>Prepare a customized consultation based on your requirements</li>
            </ul>
          </div>
          
          <p style="color: #333;">If you need to make any changes or have questions, please contact us:</p>
          <p style="color: #333; margin: 10px 0;">
            <strong>Phone:</strong> +27 760618310<br>
            <strong>Email:</strong> terblanche@ironnest.co.za
          </p>
        </div>
        
        <div style="background: #333; color: #fff; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">Thank you for choosing IronNest Installations</p>
          <p style="margin: 5px 0 0 0;">Professional Gym Setup Services | Cape Town, South Africa</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: booking.email,
      subject: 'Consultation Booking Confirmation - IronNest Installations',
      htmlContent,
    });
  }
}

export const emailService = new EmailService();