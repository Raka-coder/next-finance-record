import { Wallet, Github } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const socialLinks = [
  { href: "https://github.com/Raka-coder/next-finance-record", icon: Github, label: "Github" },
];

const productLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/", label: "Laporan" },
  { href: "/", label: "Analytics" },
];

const supportLinks = [
  { href: "https://github.com/Raka-coder/next-finance-record", label: "Dokumentasi" },
];

export default function Footer() {
  return (
    <footer className="bg-background py-16 pb-8 lg:px-0 md:px-2 px-2">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg lg:text-xl font-bold">FinanceRecord</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Platform manajemen keuangan modern yang membantu Anda mencapai
              tujuan finansial dengan teknologi terdepan dan keamanan tingkat
              enterprise.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <Link href={link.href} key={index}>
                  <Button variant="ghost" size="icon">
                    <link.icon className="w-5 h-5" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-4">Produk</h4>
            <ul className="space-y-2 text-muted-foreground">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">Dukungan</h4>
            <ul className="space-y-2 text-muted-foreground">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-muted-foreground text-sm text-center">
              © 2025 FinanceRecord. All rights reserved.
            </p>
            {/* <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Cookies</a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};