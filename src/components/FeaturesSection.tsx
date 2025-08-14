"use client"
import { Wallet, PieChartIcon, TrendingUp, Target, Shield, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Wallet className="w-8 h-8 text-emerald-600" />,
      title: "Manajemen Transaksi",
      description:
        "Catat pemasukan dan pengeluaran dengan mudah. Kategorisasi otomatis dan pencarian cepat.",
      bgColor: "bg-emerald-100", // Warna hijau untuk keuangan/transaksi
    },
    {
      icon: <PieChartIcon className="w-8 h-8 text-blue-600" />,
      title: "Visualisasi Data",
      description:
        "Dashboard interaktif dengan grafik dan chart untuk analisis keuangan yang mendalam.",
      bgColor: "bg-blue-100", // Warna biru untuk data/analitik
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
      title: "Laporan Otomatis",
      description:
        "Laporan keuangan periodik otomatis dengan insights dan rekomendasi personal.",
      bgColor: "bg-indigo-100", // Warna indigo untuk laporan/insight
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      title: "Goal Tracking",
      description:
        "Tetapkan target keuangan dan pantau progress dengan visual yang motivatif.",
      bgColor: "bg-orange-100", // Warna oranye untuk target/tujuan
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Keamanan Tinggi",
      description:
        "Data terenkripsi dengan Row Level Security. Hanya Anda yang bisa mengakses data Anda.",
      bgColor: "bg-red-100", // Warna merah untuk keamanan/perlindungan
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      title: "Multi Platform",
      description:
        "Akses dari mana saja - web, mobile, atau desktop. Sinkronisasi real-time di semua device.",
      bgColor: "bg-purple-100", // Warna ungu untuk global/multi-platform
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Fitur Lengkap untuk Keuangan Anda
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola keuangan dengan profesional
            dan efisien
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};