"use client";
import Navbar from "../Navbar";
import HeroSection from "../HeroSection";
import FeaturesSection from "../FeaturesSection";
import TrustSection from "../TrustSection";
import DemoSection from "../DemoSection";
import TestimonialsSection from "../TestimonialSection";
import Footer from "../Footer";

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <TrustSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
