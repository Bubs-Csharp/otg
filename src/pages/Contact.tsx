import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnimatedSection } from "@/components/ui/animated-section";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Images
import contactReceptionImage from "@/assets/images/contact-reception.jpg";
import teamGroupImage from "@/assets/images/team-group.jpg";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(20, "Phone number is too long"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    content: "+27 12 345 6789",
    action: "tel:+27123456789",
    actionLabel: "Call now",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@therapyonthego.co.za",
    action: "mailto:info@therapyonthego.co.za",
    actionLabel: "Send email",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    content: "+27 82 123 4567",
    action: "https://wa.me/27821234567",
    actionLabel: "Chat now",
  },
  {
    icon: Clock,
    title: "Hours",
    content: "Mon-Fri: 7am - 6pm",
    action: null,
    actionLabel: null,
  },
];

const services = [
  "Medical Surveillance",
  "Wellness Screenings",
  "Corporate Health Programs",
  "Drivers Medicals (PrDP)",
  "Executive Health Assessment",
  "Vision Screening",
  "Vaccinations",
  "Other",
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in your healthcare services. My name is ${formData.name || "[Your Name]"} and I'd like to enquire about ${formData.service || "your services"}.`
    );
    window.open(`https://wa.me/27821234567?text=${message}`, "_blank");
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={contactReceptionImage} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up" className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">Contact Us</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Ready to book an appointment or have questions about our services? 
              We're here to help. Reach out to us through any of the channels below.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={index * 100}>
                <Card className="border-0 shadow-soft bg-card hover-lift h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">{item.content}</p>
                    {item.action && (
                      <Button 
                        asChild 
                        variant="link" 
                        className="text-primary p-0 h-auto"
                      >
                        <a href={item.action} target={item.action.startsWith("http") ? "_blank" : undefined}>
                          {item.actionLabel}
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <AnimatedSection animation="fade-right">
              <Card className="border-0 shadow-soft bg-card">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                        Thank You!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Your message has been sent successfully. We'll get back to you within 24 hours.
                      </p>
                      <Button onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
                      }}>
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                        Send Us a Message
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              placeholder="John Smith"
                              value={formData.name}
                              onChange={(e) => handleChange("name", e.target.value)}
                              className={errors.name ? "border-destructive" : ""}
                            />
                            {errors.name && (
                              <p className="text-sm text-destructive animate-fade-in">{errors.name}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => handleChange("email", e.target.value)}
                              className={errors.email ? "border-destructive" : ""}
                            />
                            {errors.email && (
                              <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+27 82 123 4567"
                              value={formData.phone}
                              onChange={(e) => handleChange("phone", e.target.value)}
                              className={errors.phone ? "border-destructive" : ""}
                            />
                            {errors.phone && (
                              <p className="text-sm text-destructive animate-fade-in">{errors.phone}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="service">Service Interested In *</Label>
                            <Select 
                              value={formData.service} 
                              onValueChange={(value) => handleChange("service", value)}
                            >
                              <SelectTrigger className={errors.service ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service} value={service}>
                                    {service}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.service && (
                              <p className="text-sm text-destructive animate-fade-in">{errors.service}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us about your needs..."
                            rows={5}
                            value={formData.message}
                            onChange={(e) => handleChange("message", e.target.value)}
                            className={errors.message ? "border-destructive" : ""}
                          />
                          {errors.message && (
                            <p className="text-sm text-destructive animate-fade-in">{errors.message}</p>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button 
                            type="submit" 
                            className="flex-1 rounded-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Message
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-full"
                            onClick={handleWhatsApp}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            WhatsApp Us
                          </Button>
                        </div>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Map & Location */}
            <AnimatedSection animation="fade-left" delay={200} className="space-y-6">
              <Card className="border-0 shadow-soft bg-card overflow-hidden">
                <CardContent className="p-0">
                  {/* Team image as map alternative */}
                  <div className="relative h-64">
                    <img 
                      src={teamGroupImage} 
                      alt="Our team" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent flex items-end justify-center pb-6">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          Nationwide Coverage
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          We serve all 9 provinces of South Africa
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft bg-card hover-lift">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Head Office
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Address</p>
                        <p className="text-muted-foreground text-sm">
                          123 Healthcare Avenue<br />
                          Sandton, Johannesburg, 2196<br />
                          Gauteng, South Africa
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Business Hours</p>
                        <p className="text-muted-foreground text-sm">
                          Monday - Friday: 7:00 AM - 6:00 PM<br />
                          Saturday: 8:00 AM - 1:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
