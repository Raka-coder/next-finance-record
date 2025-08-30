"use client"
import { CheckCircle2, Github, Lock, Database, Users, ExternalLink, Shield, Globe } from "lucide-react";
import { Card, CardContent, CardTitle, CardDescription } from "./ui/card";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Link from "next/link";

export default function TrustSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Keamanan & Transparansi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kepercayaan Anda adalah prioritas utama kami. Lihat bagaimana kami
            melindungi data Anda.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Row Level Security
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Kami menggunakan Supabase dengan Row Level Security untuk
                      memastikan data Anda hanya bisa diakses oleh Anda sendiri.
                      Setiap baris data memiliki kebijakan keamanan yang ketat
                      berdasarkan identitas pengguna.
                    </CardDescription>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center space-x-3 bg-muted/50 rounded-lg p-4">
                    <Lock className="w-6 h-6 text-primary" />
                    <span className="font-medium">End-to-End Encryption</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-muted/50 rounded-lg p-4">
                    <Database className="w-6 h-6 text-green-600" />
                    <span className="font-medium">Secure Database</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-muted/50 rounded-lg p-4">
                    <Users className="w-6 h-6 text-purple-600" />
                    <span className="font-medium">User Isolation</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-muted/50 rounded-lg p-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <span className="font-medium">GDPR Compliant</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg mb-2">Open Source</CardTitle>
                <CardDescription className="mb-4">
                  Kode sumber terbuka untuk transparansi penuh. Audit keamanan
                  dapat dilakukan oleh siapa saja.
                </CardDescription>
                <Button variant="outline" size="sm">
                  <Link href="https://github.com/Raka-coder/next-finance-record">Lihat di Github</Link>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg mb-2">
                  Dokumentasi Teknis
                </CardTitle>
                <CardDescription className="mb-4">
                  Dokumentasi lengkap tentang arsitektur keamanan dan
                  implementasi untuk transparansi.
                </CardDescription>
                <Button variant="outline" size="sm">
                  <Link href="https://github.com/Raka-coder/next-finance-record">Baca Dokumentasi</Link>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};