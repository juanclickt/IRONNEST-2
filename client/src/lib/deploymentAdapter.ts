// Deployment adapter to handle different hosting environments
import { staticStorage } from './staticStorage';
import { apiRequest } from './queryClient';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  timeSlot: string;
  location: string;
  message: string;
  status: string;
  createdAt: string;
}

class DeploymentAdapter {
  private isNetlify(): boolean {
    return window.location.hostname.includes('netlify.app') || 
           window.location.hostname.includes('netlify.com');
  }

  async getContacts(): Promise<Contact[]> {
    if (this.isNetlify()) {
      try {
        const response = await fetch('/.netlify/functions/contacts');
        const data = await response.json();
        return data;
      } catch (error) {
        console.warn('Netlify function failed, falling back to localStorage');
        return staticStorage.getContacts();
      }
    }
    
    staticStorage.initializeData();
    return staticStorage.getContacts();
  }

  async createContact(contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
    if (this.isNetlify()) {
      try {
        const response = await fetch('/.netlify/functions/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact)
        });
        const result = await response.json();
        return result.data;
      } catch (error) {
        console.warn('Netlify function failed, falling back to localStorage');
      }
    }
    
    return staticStorage.createContact(contact);
  }

  async deleteContact(id: number): Promise<boolean> {
    if (this.isNetlify()) {
      try {
        const response = await fetch(`/.netlify/functions/contacts/${id}`, {
          method: 'DELETE'
        });
        return response.ok;
      } catch (error) {
        console.warn('Netlify function failed, falling back to localStorage');
      }
    }
    
    return staticStorage.deleteContact(id);
  }

  async getBookings(): Promise<Booking[]> {
    if (this.isNetlify()) {
      try {
        const response = await fetch('/.netlify/functions/bookings');
        const data = await response.json();
        return data;
      } catch (error) {
        console.warn('Netlify function failed, falling back to localStorage');
        return staticStorage.getBookings();
      }
    }
    
    return staticStorage.getBookings();
  }

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
    if (this.isNetlify()) {
      try {
        const response = await fetch('/.netlify/functions/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(booking)
        });
        const result = await response.json();
        return result.data;
      } catch (error) {
        console.warn('Netlify function failed, falling back to localStorage');
      }
    }
    
    return staticStorage.createBooking(booking);
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    if (this.isNetlify()) {
      try {
        const response = await fetch(`/.netlify/functions/bookings/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        const result = await response.json();
        return result.data;
      } catch (error) {
        console.warn('Netlify function failed, falling back to localStorage');
      }
    }
    
    return staticStorage.updateBookingStatus(id, status);
  }

  async authenticateAdmin(username: string, password: string): Promise<boolean> {
    if (this.isNetlify()) {
      try {
        const response = await fetch('/.netlify/functions/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        return result.success;
      } catch (error) {
        console.warn('Netlify auth failed, falling back to local auth');
      }
    }
    
    // Fallback to local authentication
    return username === 'Admin' && password === 'IronNest2025';
  }
}

export const deploymentAdapter = new DeploymentAdapter();