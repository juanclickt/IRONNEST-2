import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarCheck, CheckCircle } from "lucide-react";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  projectType: z.string().min(1, "Project type is required"),
  budget: z.string().optional(),
  location: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  message: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, "You must agree to be contacted"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingSystem() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      budget: "",
      location: "",
      date: "",
      time: "",
      message: "",
      terms: false,
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: Omit<BookingFormData, "terms">) => {
      const { emailService } = await import("@/lib/emailService");
      const bookingData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        serviceType: data.projectType,
        budget: data.budget || "",
        preferredDate: data.date,
        timeSlot: data.time,
        location: data.location || "",
        message: data.message || ""
      };
      
      // Send notification to business and confirmation to client
      const [notificationSent, confirmationSent] = await Promise.all([
        emailService.sendBookingNotification(bookingData),
        emailService.sendConfirmationToClient(bookingData)
      ]);
      
      if (!notificationSent) {
        throw new Error('Failed to send booking notification');
      }
      
      return bookingData;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Consultation Booked!",
        description: "We'll confirm your appointment within 24 hours.",
      });
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        form.reset();
      }, 5000);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    const { terms, ...bookingData } = data;
    bookingMutation.mutate(bookingData);
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  if (isSubmitted) {
    return (
      <section id="booking" className="py-20 bg-iron-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 text-black shadow-2xl text-center">
            <CheckCircle className="text-green-500 text-6xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-2">Consultation Booked!</h3>
            <p className="text-gray-600">We'll confirm your appointment within 24 hours.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-iron-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-6">
            BOOK YOUR <span className="text-iron-green">CONSULTATION</span>
          </h2>
          <p className="text-xl text-gray-300">Let's discuss your gym installation project</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 text-black shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Email Address *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="your.email@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Phone Number *</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="+27 123 456 789" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Project Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="home-gym">Home Gym</SelectItem>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="academy">Training Academy</SelectItem>
                          <SelectItem value="club">Commercial Club</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Budget Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="under-50k">Under R50,000</SelectItem>
                          <SelectItem value="50k-100k">R50,000 - R100,000</SelectItem>
                          <SelectItem value="100k-250k">R100,000 - R250,000</SelectItem>
                          <SelectItem value="250k-500k">R250,000 - R500,000</SelectItem>
                          <SelectItem value="over-500k">Over R500,000</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Location (Cape Town Area)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Camps Bay, Claremont" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Preferred Date *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" min={today} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Preferred Time *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="09:00">09:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="14:00">02:00 PM</SelectItem>
                          <SelectItem value="15:00">03:00 PM</SelectItem>
                          <SelectItem value="16:00">04:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Project Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4} 
                        placeholder="Tell us about your vision, space dimensions, specific requirements..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-gray-600">
                        I agree to be contacted regarding my consultation booking *
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-center">
                <Button 
                  type="submit" 
                  disabled={bookingMutation.isPending}
                  className="bg-iron-green text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-400 transition-all duration-200 transform hover:scale-105"
                >
                  {bookingMutation.isPending ? (
                    "Booking..."
                  ) : (
                    <>
                      <CalendarCheck className="w-5 h-5 mr-2" />
                      Book Consultation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
