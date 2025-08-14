"use client"
import { TrendingUp, Wallet, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { Progress } from "./ui/progress";
// import { ExportDatePicker } from "./export-date-picker";
import { PieChart } from "./charts/pie-chart";

export default function DemoSection(){
  const demoData = [
    {
      date: "07/08/2025",
      description: "Bekal",
      category: "Lainnya",
      type: "income",
      amount: 50000,
    },
    {
      date: "07/08/2025",
      description: "Makan",
      category: "Makanan",
      type: "expense",
      amount: 20000,
    },
    {
      date: "07/08/2025",
      description: "Bahan bakar",
      category: "Transportasi",
      type: "expense",
      amount: 10000,
    },
    {
      date: "06/08/2025",
      description: "Belanja",
      category: "Belanja",
      type: "expense",
      amount: 39999,
    },
    {
      date: "05/08/2025",
      description: "Bonus",
      category: "Bonus",
      type: "income",
      amount: 100000,
    },
  ];

  // Calculate totals
  const totalIncome = demoData
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = demoData
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  return (
    <section id="demo" className="py-24 bg-muted/50 rounded-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Lihat Demo Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dashboard intuitif dengan visualisasi data yang memudahkan analisis
            keuangan Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Dashboard Stats */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardDescription>Total Pemasukan</CardDescription>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    Rp 1.810.000
                  </div>
                  <CardDescription className="mt-1">
                    9 transaksi
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardDescription>Total Pengeluaran</CardDescription>
                    <TrendingUp className="w-5 h-5 text-red-500 rotate-180" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    Rp 474.999
                  </div>
                  <CardDescription className="mt-1">
                    17 transaksi
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardDescription>Saldo</CardDescription>
                    <Wallet className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    Rp 1.335.001
                  </div>
                  <CardDescription className="mt-1">Surplus</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardDescription>Rasio Pengeluaran</CardDescription>
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {expenseRatio.toFixed(1)}%
                  </div>
                  <Progress value={expenseRatio} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Distribusi Pengeluaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <PieChart
                    title="Distribusi Pengeluaran"
                    data={[
                      { name: "Makanan", y: 20000 },
                      { name: "Transportasi", y: 30000 },
                      { name: "Belanja", y: 150000 },
                      { name: "Lainnya", y: 50000 },
                    ]}
                    height={350}
                    showLegend={true}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transaction Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Transaksi Terbaru</CardTitle>
                <CardDescription>26 transaksi, 2 periode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demoData.map((item, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="text-sm">{item.date}</TableCell>
                          <TableCell className="text-sm">
                            {item.description}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.type === "income"
                                  ? "success"
                                  : "destructive"
                              }
                            >
                              {item.type === "income"
                                ? "Pemasukan"
                                : "Pengeluaran"}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`text-sm font-medium text-right ${
                              item.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            } `}
                          >
                            {item.type === "income" ? "+" : "-"}Rp{" "}
                            {item.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            {/* Export data */}
            <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* <ExportDatePicker
              onExport={async (startDate, endDate) => {
                // Implementasi ekspor data ke CSV
                console.log(
                  "Mengekspor data dari",
                  startDate,
                  "sampai",
                  endDate
                );
                // ... kode ekspor data
              }}
            /> */}
          </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};