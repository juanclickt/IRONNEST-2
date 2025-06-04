import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Mail, Phone, MapPin, DollarSign, MessageSquare, Clock, User, Trash2, Filter } from "lucide-react";
import { format, isAfter, isBefore, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import companyLogo from "@assets/1.png";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { toast } = useToast();
  const [dateFilter, setDateFilter] = useState("all");
  
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { deploymentAdapter } = await import("@/lib/deploymentAdapter");
      return deploymentAdapter.getContacts();
    }
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { deploymentAdapter } = await import("@/lib/deploymentAdapter");
      return deploymentAdapter.getBookings();
    }
  });

  const filterByDate = (items: any[], filter: string) => {
    if (filter === "all") return items;
    
    const now = new Date();
    return items.filter((item: any) => {
      const itemDate = new Date(item.createdAt);
      
      switch (filter) {
        case "today":
          return isAfter(itemDate, startOfDay(now)) && isBefore(itemDate, endOfDay(now));
        case "this-week":
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - 7);
          return isAfter(itemDate, weekStart);
        case "this-month":
          return isAfter(itemDate, startOfMonth(now)) && isBefore(itemDate, endOfMonth(now));
        case "this-year":
          return isAfter(itemDate, startOfYear(now)) && isBefore(itemDate, endOfYear(now));
        default:
          return true;
      }
    });
  };

  const filteredContacts = filterByDate(contacts, dateFilter);
  const filteredBookings = filterByDate(bookings, dateFilter);

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { deploymentAdapter } = await import("@/lib/deploymentAdapter");
      return deploymentAdapter.updateBookingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Status Updated",
        description: "Booking status has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (contactId: number) => {
      const { deploymentAdapter } = await import("@/lib/deploymentAdapter");
      return deploymentAdapter.deleteContact(contactId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({
        title: "Contact Deleted",
        description: "Contact has been deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (bookingId: number, newStatus: string) => {
    updateBookingStatusMutation.mutate({ id: bookingId, status: newStatus });
  };

  const handleDeleteContact = (contactId: number) => {
    deleteContactMutation.mutate(contactId);
  };

  if (contactsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iron-green mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img src={companyLogo} alt="IronNest Logo" className="h-12 w-auto" />
            </div>
            <Button 
              onClick={onLogout}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Logout
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2">IronNest Admin Dashboard</h1>
          <p className="text-gray-400">Manage contact submissions and consultation bookings</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="h-5 w-5 text-iron-green" />
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48 bg-iron-dark border-gray-600 text-white">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent className="bg-iron-dark border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-600">All Time</SelectItem>
                <SelectItem value="today" className="text-white hover:bg-gray-600">Today</SelectItem>
                <SelectItem value="this-week" className="text-white hover:bg-gray-600">This Week</SelectItem>
                <SelectItem value="this-month" className="text-white hover:bg-gray-600">This Month</SelectItem>
                <SelectItem value="this-year" className="text-white hover:bg-gray-600">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-iron-dark border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Contacts</CardTitle>
              <Mail className="h-4 w-4 text-iron-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{filteredContacts.length}</div>
              <p className="text-xs text-gray-400">
                {dateFilter === "all" ? "All time" : `Filtered: ${dateFilter}`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-iron-dark border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Bookings</CardTitle>
              <CalendarDays className="h-4 w-4 text-iron-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{filteredBookings.length}</div>
              <p className="text-xs text-gray-400">
                {dateFilter === "all" ? "All time" : `Filtered: ${dateFilter}`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-iron-dark border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-iron-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {filteredBookings.filter((b: any) => b.status === 'pending').length}
              </div>
              <p className="text-xs text-gray-400">
                {dateFilter === "all" ? "All time" : `Filtered: ${dateFilter}`}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="bg-iron-dark border-gray-700">
            <TabsTrigger value="contacts" className="data-[state=active]:bg-iron-green data-[state=active]:text-black">
              Contact Submissions
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-iron-green data-[state=active]:text-black">
              Consultation Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-4">
            {filteredContacts.length === 0 ? (
              <Card className="bg-iron-dark border-gray-700">
                <CardContent className="py-8 text-center">
                  <Mail className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {dateFilter === "all" ? "No contact submissions yet" : `No contacts found for ${dateFilter}`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredContacts.map((contact: any) => (
                <Card key={contact.id} className="bg-iron-dark border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <User className="h-5 w-5 text-iron-green" />
                          {contact.name}
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">
                          {format(new Date(contact.createdAt), "PPpp")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-600 text-white">
                          Contact
                        </Badge>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-iron-green" />
                        <span className="text-sm text-gray-300">{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-iron-green" />
                          <span className="text-sm text-gray-300">{contact.phone}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Subject: {contact.subject}</h4>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-300 text-sm">{contact.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card className="bg-iron-dark border-gray-700">
                <CardContent className="py-8 text-center">
                  <CalendarDays className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {dateFilter === "all" ? "No consultation bookings yet" : `No bookings found for ${dateFilter}`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking: any) => (
                <Card key={booking.id} className="bg-iron-dark border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <User className="h-5 w-5 text-iron-green" />
                          {booking.name}
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">
                          {format(new Date(booking.createdAt), "PPpp")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusChange(booking.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8 bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="pending" className="text-white hover:bg-gray-600">
                              Pending
                            </SelectItem>
                            <SelectItem value="confirmed" className="text-white hover:bg-gray-600">
                              Confirmed
                            </SelectItem>
                            <SelectItem value="completed" className="text-white hover:bg-gray-600">
                              Completed
                            </SelectItem>
                            <SelectItem value="cancelled" className="text-white hover:bg-gray-600">
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge 
                          variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                          className={
                            booking.status === 'confirmed' ? 'bg-green-600 text-white' :
                            booking.status === 'pending' ? 'bg-yellow-600 text-white' :
                            booking.status === 'completed' ? 'bg-blue-600 text-white' :
                            'bg-red-600 text-white'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-iron-green" />
                        <span className="text-sm text-gray-300">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-iron-green" />
                        <span className="text-sm text-gray-300">{booking.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-iron-green" />
                        <span className="text-sm text-gray-300">{booking.date} at {booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-iron-green" />
                        <span className="text-sm text-gray-300">{booking.budget}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-iron-green" />
                        <span className="text-sm text-gray-300">{booking.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-iron-green" />
                        <span className="text-sm text-gray-300">{booking.projectType}</span>
                      </div>
                    </div>
                    {booking.message && (
                      <div>
                        <h4 className="font-semibold text-white mb-2">Additional Details:</h4>
                        <div className="bg-gray-700 p-3 rounded-lg">
                          <p className="text-gray-300 text-sm">{booking.message}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}