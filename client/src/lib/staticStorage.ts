// Static storage for client-side data management
export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Booking {
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

class StaticStorage {
  private getStorageKey(type: string): string {
    return `ironnest_${type}`;
  }

  private getNextId(type: string): number {
    const items = this.getItems(type);
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }

  private getItems(type: string): any[] {
    const data = localStorage.getItem(this.getStorageKey(type));
    return data ? JSON.parse(data) : [];
  }

  private saveItems(type: string, items: any[]): void {
    localStorage.setItem(this.getStorageKey(type), JSON.stringify(items));
  }

  // Contact methods
  getContacts(): Contact[] {
    return this.getItems('contacts');
  }

  createContact(contact: Omit<Contact, 'id' | 'createdAt'>): Contact {
    const newContact: Contact = {
      ...contact,
      id: this.getNextId('contacts'),
      createdAt: new Date().toISOString()
    };
    
    const contacts = this.getContacts();
    contacts.push(newContact);
    this.saveItems('contacts', contacts);
    
    return newContact;
  }

  deleteContact(id: number): boolean {
    const contacts = this.getContacts();
    const filteredContacts = contacts.filter(contact => contact.id !== id);
    this.saveItems('contacts', filteredContacts);
    return true;
  }

  // Booking methods
  getBookings(): Booking[] {
    return this.getItems('bookings');
  }

  createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
    const newBooking: Booking = {
      ...booking,
      id: this.getNextId('bookings'),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    const bookings = this.getBookings();
    bookings.push(newBooking);
    this.saveItems('bookings', bookings);
    
    return newBooking;
  }

  updateBookingStatus(id: number, status: string): Booking | undefined {
    const bookings = this.getBookings();
    const bookingIndex = bookings.findIndex(booking => booking.id === id);
    
    if (bookingIndex === -1) return undefined;
    
    bookings[bookingIndex].status = status;
    this.saveItems('bookings', bookings);
    
    return bookings[bookingIndex];
  }

  // Initialize with some sample data if empty
  initializeData(): void {
    if (this.getContacts().length === 0) {
      this.createContact({
        name: "David Miller",
        email: "david.miller@outlook.com",
        phone: "+27 81 999 1234",
        subject: "Studio Gym Setup Inquiry",
        message: "Hello! I run a personal training studio and need to upgrade our equipment. We have about 50 square meters and are looking for professional-grade equipment. Can we schedule a consultation to discuss options and pricing?"
      });

      this.createContact({
        name: "Emma Wilson",
        email: "emma.wilson@gmail.com",
        phone: "+27 82 765 4321",
        subject: "Home Gym Equipment Question",
        message: "Hi there! I saw your work online and I am impressed. I have a small home gym but some equipment needs repair. Do you also provide maintenance services? My treadmill motor is making strange noises."
      });
    }

    if (this.getBookings().length === 0) {
      this.createBooking({
        name: "Sarah Johnson",
        email: "sarah.j@gmail.com",
        phone: "+27 83 555 7890",
        serviceType: "Home Gym Design",
        preferredDate: "2025-06-15",
        timeSlot: "10:00 AM",
        location: "Cape Town, Claremont",
        message: "Looking to convert my garage into a home gym. Space is about 30 square meters."
      });

      this.createBooking({
        name: "Mike Thompson",
        email: "mike.thompson@email.com",
        phone: "+27 84 123 4567",
        serviceType: "Equipment Installation",
        preferredDate: "2025-06-20",
        timeSlot: "2:00 PM",
        location: "Stellenbosch",
        message: "Need help installing commercial-grade equipment for our new studio."
      });
    }
  }
}

export const staticStorage = new StaticStorage();