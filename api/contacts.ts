import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const [contact] = await db.insert(contacts).values(validatedData).returning();
      
      res.json({ success: true, message: "Contact form submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  } else if (req.method === 'GET') {
    try {
      const contactsList = await db.select().from(contacts);
      res.json(contactsList);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve contacts" });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const contactId = parseInt(id as string);
      await db.delete(contacts).where(eq(contacts.id, contactId));
      res.json({ success: true, message: "Contact deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}