import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  projectType: text("project_type").notNull(),
  budget: text("budget"),
  location: text("location"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  message: text("message"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  status: true
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const [booking] = await db.insert(bookings).values({
        ...validatedData,
        status: "pending"
      }).returning();
      
      res.json({ success: true, message: "Consultation booked successfully", booking });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid booking data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  } else if (req.method === 'GET') {
    try {
      const bookingsList = await db.select().from(bookings);
      res.json(bookingsList);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve bookings" });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      const { status } = req.body;
      const bookingId = parseInt(id as string);
      
      const [booking] = await db.update(bookings)
        .set({ status })
        .where(eq(bookings.id, bookingId))
        .returning();
        
      res.json({ success: true, booking });
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking status" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}