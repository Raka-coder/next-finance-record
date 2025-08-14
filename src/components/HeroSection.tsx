"use client"
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { BackgroundBeams } from "./ui/background-beams";
import { TypewriterEffect } from "./ui/typewriter-effect";
import { motion } from "framer-motion";
import { Eye, CheckCircle2, Shield, Zap } from "lucide-react";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -80; // Offset untuk navbar
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
};

export default function HeroSection() {
  // Fungsi untuk menangani klik pada tombol demo
  const handleDemoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToSection("demo");
  };

  return (
    <>
      <div className="h-16" /> {/* Added space above the section */}
      <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
        <BackgroundBeams />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
              Kelola <TypewriterEffect /> Anda dengan Mudah
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Platform manajemen keuangan modern yang membantu Anda melacak
              pemasukan, pengeluaran, dan mencapai tujuan finansial dengan
              visualisasi data yang menarik.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="font-medium px-4 py-4">
                <Link href="/login">Mulai Gratis</Link>
                <ArrowRight className="w-5 h-5 mt-0.5 ml-1" />
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="font-medium px-4 py-4 w-full"
                >
                  <Eye className="w-5 h-5 mt-0.5 mr-1" />
                  <a href="#demo" onClick={handleDemoClick}>
                    Lihat Demo
                  </a>
                </Button>
              </motion.div>
            </div>

            <div className="mt-16 flex justify-center items-center space-x-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm">100% Gratis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Data Aman</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
