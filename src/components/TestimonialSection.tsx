"use client"
import { Card, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialsSection(){
  const testimonials = [
    {
      name: "Andi Pratama",
      role: "Freelancer",
      avatar: "AP",
      rating: 5,
      comment:
        "Aplikasi ini sangat membantu saya melacak pemasukan dari berbagai klien. Interface yang sederhana tapi powerful!",
    },
    {
      name: "Sari Dewi",
      role: "Ibu Rumah Tangga",
      avatar: "SD",
      rating: 5,
      comment:
        "Akhirnya bisa mengatur keuangan rumah tangga dengan mudah. Fitur kategori pengeluaran sangat membantu.",
    },
    {
      name: "Budi Santoso",
      role: "Pengusaha UMKM",
      avatar: "BS",
      rating: 5,
      comment:
        "Dashboard yang informatif dan mudah dipahami. Membantu saya memantau cash flow bisnis dengan efektif.",
    },
    {
      name: "Maya Kusuma",
      role: "Mahasiswa",
      avatar: "MK",
      rating: 4,
      comment:
        "Perfect untuk mahasiswa seperti saya. Bisa track uang jajan dan tabungan dengan mudah. Gratis pula!",
    },
    {
      name: "Rahman Ali",
      role: "Karyawan Swasta",
      avatar: "RA",
      rating: 5,
      comment:
        "Fitur goal tracking memotivasi saya untuk menabung. Visualisasi progress yang menarik dan mudah dipahami.",
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
    <section id="testimonials" className="py-24 bg-muted/50 rounded-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Apa Kata Pengguna Kami
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ribuan pengguna telah mempercayakan pengelolaan keuangan mereka
            dengan platform kami
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {testimonial.comment}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Card className="inline-block">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {testimonials.slice(0, 4).map((testimonial, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs border-2 border-background"
                    >
                      {testimonial.avatar}
                    </div>
                  ))}
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-bold text-xs border-2 border-background">
                    +100
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">100+ Pengguna Aktif</p>
                  <p className="text-xs text-muted-foreground">
                    Rating rata-rata 4.9/5
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};