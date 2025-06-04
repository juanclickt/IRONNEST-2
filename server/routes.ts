import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Email API endpoint
  app.post("/api/send_email", async (req, res) => {
    try {
      const { to, subject, htmlContent, textContent } = req.body;

      if (!process.env.BREVO_API_KEY) {
        return res.status(500).json({ error: 'Brevo API key not configured' });
      }

      const emailPayload = {
        sender: {
          name: 'IronNest Installations',
          email: 'terblanche@ironnest.co.za'
        },
        to: [{ email: to }],
        subject,
        htmlContent,
        textContent: textContent || subject
      };
      
      console.log('Sending email with payload:', JSON.stringify(emailPayload, null, 2));

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
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
      return res.status(200).json({ success: true, messageId: result.messageId, result });

    } catch (error) {
      console.error('Email service error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  // Contact form submission
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      
      // Store contact data (admin dashboard will show all contacts)
      
      res.json({ success: true, message: "Contact form submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve contacts" });
    }
  });

  // Delete a contact
  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContact(id);
      
      if (!success) {
        return res.status(404).json({ error: "Contact not found" });
      }
      
      res.json({ success: true, message: "Contact deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // Booking submission
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      
      // Store booking data (admin dashboard will show all bookings)
      
      res.json({ success: true, message: "Consultation booked successfully", booking });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid booking data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all bookings (for admin purposes)
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve bookings" });
    }
  });

  // Update booking status
  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const booking = await storage.updateBookingStatus(id, status);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      res.json({ success: true, booking });
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
