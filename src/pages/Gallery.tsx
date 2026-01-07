import { useState } from "react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AnimatedSection } from "@/components/ui/animated-section";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

// Images
import teamGroupImage from "@/assets/images/team-group.jpg";
import mobileClinicImage from "@/assets/images/mobile-clinic.jpg";
import galleryCorporateWellness from "@/assets/images/gallery-corporate-wellness.jpg";
import galleryAudiometry from "@/assets/images/gallery-audiometry.jpg";
import galleryMiningHealth from "@/assets/images/gallery-mining-health.jpg";
import nursePortrait from "@/assets/images/nurse-portrait-1.jpg";
import galleryOfficeHealth from "@/assets/images/gallery-office-health.jpg";
import gallerySpirometry from "@/assets/images/gallery-spirometry.jpg";
import galleryConstruction from "@/assets/images/gallery-construction.jpg";
import doctorPortrait from "@/assets/images/doctor-portrait-1.jpg";
import galleryFactory from "@/assets/images/gallery-factory.jpg";
import galleryVisionTest from "@/assets/images/gallery-vision-test.jpg";

const categories = [
  { id: "all", name: "All" },
  { id: "team", name: "Our Team" },
  { id: "onsite", name: "On-Site Services" },
  { id: "corporate", name: "Corporate Events" },
  { id: "equipment", name: "Equipment" },
];

const galleryItems = [
  {
    id: 1,
    category: "team",
    title: "Our Medical Team",
    description: "Dedicated healthcare professionals ready to serve",
    image: teamGroupImage,
  },
  {
    id: 2,
    category: "onsite",
    title: "Mobile Health Unit",
    description: "Fully equipped mobile clinic for on-site services",
    image: mobileClinicImage,
  },
  {
    id: 3,
    category: "corporate",
    title: "Corporate Wellness Day",
    description: "Health screening event at a major corporate client",
    image: galleryCorporateWellness,
  },
  {
    id: 4,
    category: "equipment",
    title: "Audiometry Equipment",
    description: "State-of-the-art hearing testing equipment",
    image: galleryAudiometry,
  },
  {
    id: 5,
    category: "onsite",
    title: "Mining Site Visit",
    description: "Medical surveillance at a platinum mine",
    image: galleryMiningHealth,
  },
  {
    id: 6,
    category: "team",
    title: "Nursing Staff",
    description: "Our experienced occupational health nurses",
    image: nursePortrait,
  },
  {
    id: 7,
    category: "corporate",
    title: "Office Health Day",
    description: "Wellness screenings at a Johannesburg office park",
    image: galleryOfficeHealth,
  },
  {
    id: 8,
    category: "equipment",
    title: "Spirometry Testing",
    description: "Lung function testing equipment",
    image: gallerySpirometry,
  },
  {
    id: 9,
    category: "onsite",
    title: "Construction Site",
    description: "Health assessments for construction workers",
    image: galleryConstruction,
  },
  {
    id: 10,
    category: "team",
    title: "Medical Director",
    description: "Dr. Mokoena reviewing patient files",
    image: doctorPortrait,
  },
  {
    id: 11,
    category: "corporate",
    title: "Factory Health Program",
    description: "Annual health checks at manufacturing facility",
    image: galleryFactory,
  },
  {
    id: 12,
    category: "equipment",
    title: "Vision Testing",
    description: "Professional vision screening equipment",
    image: galleryVisionTest,
  },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredItems = activeCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const currentIndex = selectedImage !== null 
    ? filteredItems.findIndex(item => item.id === selectedImage) 
    : -1;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredItems[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImage(filteredItems[currentIndex + 1].id);
    }
  };

  const selectedItem = galleryItems.find(item => item.id === selectedImage);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 gradient-soft overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">Gallery</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              See Us in Action
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore photos from our team, on-site visits, corporate events, and the professional equipment we use to deliver quality healthcare.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={cn(
                  "rounded-full transition-all duration-300",
                  activeCategory === category.id && "shadow-warm scale-105"
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredItems.map((item, index) => (
              <AnimatedSection
                key={item.id}
                animation="scale-in"
                delay={index * 50}
                className={cn(
                  "break-inside-avoid group cursor-pointer relative overflow-hidden rounded-xl",
                  index % 3 === 0 ? "aspect-square" : index % 3 === 1 ? "aspect-[4/5]" : "aspect-[3/4]"
                )}
                onClick={() => setSelectedImage(item.id)}
              >
                {/* Image */}
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-100 scale-50 duration-300" />
                </div>
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-semibold text-primary-foreground text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-primary-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-0 shadow-none">
          <div className="relative">
            {/* Image container */}
            <div className="relative rounded-xl overflow-hidden bg-background shadow-2xl">
              {selectedItem && (
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.title}
                  className="w-full h-auto max-h-[80vh] object-contain animate-scale-in"
                />
              )}
              {/* Title overlay */}
              {selectedItem && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/80 to-transparent">
                  <h2 className="font-display text-2xl font-bold text-primary-foreground mb-1">
                    {selectedItem.title}
                  </h2>
                  <p className="text-primary-foreground/80">
                    {selectedItem.description}
                  </p>
                </div>
              )}
            </div>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 rounded-full bg-foreground/20 text-primary-foreground hover:bg-foreground/40"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Navigation */}
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-foreground/20 text-primary-foreground hover:bg-foreground/40 hover:scale-110 transition-transform"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            {currentIndex < filteredItems.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-foreground/20 text-primary-foreground hover:bg-foreground/40 hover:scale-110 transition-transform"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* Counter */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-foreground/20 text-primary-foreground text-sm">
              {currentIndex + 1} / {filteredItems.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;
