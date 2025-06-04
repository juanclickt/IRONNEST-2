import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Home, 
  Building, 
  GraduationCap, 
  Users, 
  Send,
  CheckCircle 
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const { emailService } = await import("@/lib/emailService");
      const contactData = {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        subject: data.subject,
        message: data.message
      };
      const success = await emailService.sendContactNotification(contactData);
      if (!success) {
        throw new Error('Failed to send email notification');
      }
      return contactData;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        form.reset();
      }, 5000);
    },
    onError: (error: any) => {
      toast({
        title: "Message Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: "Cape Town, South Africa"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+27 760618310"
    },
    {
      icon: Mail,
      title: "Email",
      details: "terblanche@ironnest.co.za"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 08h00-17h00"
    }
  ];

  const services = [
    { icon: Home, title: "Home Gyms" },
    { icon: Building, title: "Studios" },
    { icon: GraduationCap, title: "Academies" },
    { icon: Users, title: "Clubs" }
  ];

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-6">
            GET IN <span className="text-iron-green">TOUCH</span>
          </h2>
          <p className="text-xl text-gray-300">Ready to transform your training space?</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-iron-dark rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-center">
                      <IconComponent className="text-iron-green text-xl mr-4 w-5 h-5" />
                      <div>
                        <p className="font-semibold">{info.title}</p>
                        <p className="text-gray-400">{info.details}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-iron-dark rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Our Services</h3>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <div key={index} className="text-center">
                      <IconComponent className="text-iron-green text-2xl mb-2 mx-auto w-6 h-6" />
                      <p className="font-semibold">{service.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 text-black shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="text-green-500 text-6xl mb-4 mx-auto" />
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel className="text-sm font-semibold">Email *</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Phone</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Subject *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="consultation">Free Consultation</SelectItem>
                            <SelectItem value="quote">Request Quote</SelectItem>
                            <SelectItem value="support">Support/Maintenance</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Message *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={5} 
                            placeholder="Tell us about your project..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={contactMutation.isPending}
                    className="w-full bg-iron-green text-black px-6 py-4 rounded-lg font-bold text-lg hover:bg-green-400 transition-all duration-200 transform hover:scale-105"
                  >
                    {contactMutation.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
