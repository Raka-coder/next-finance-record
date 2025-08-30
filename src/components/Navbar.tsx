"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wallet, X, Menu } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ThemeToggle } from "./theme-toggle"
import { AnimatePresence } from "framer-motion"

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


export default function Navbar() {

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi untuk menangani klik pada menu
  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToSection(id);
    setIsOpen(false); // Tutup menu mobile jika terbuka
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <Link href="/" className="text-lg lg:text-lg font-medium">
              FinanceRecord
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a
              href="#features"
              onClick={(e) => handleMenuClick(e, "features")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Features
            </motion.a>
            <motion.a
              href="#demo"
              onClick={(e) => handleMenuClick(e, "demo")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Demo
            </motion.a>
            <motion.a
              href="#testimonials"
              onClick={(e) => handleMenuClick(e, "testimonials")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reviews
            </motion.a>
            <ThemeToggle />
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden border-t bg-background"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <motion.a
                  href="#features"
                  onClick={(e) => handleMenuClick(e, "features")}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Features
                </motion.a>
                <motion.a
                  href="#demo"
                  onClick={(e) => handleMenuClick(e, "demo")}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Demo
                </motion.a>
                <motion.a
                  href="#testimonials"
                  onClick={(e) => handleMenuClick(e, "testimonials")}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reviews
                </motion.a>
                <div className="pt-2">
                  <Button className="w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
