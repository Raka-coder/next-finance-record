import * as z from "zod";

export const editTransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z
    .string()
    .min(1, "Jumlah harus diisi")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Jumlah harus berupa angka positif",
    }),
  description: z.string().min(1, "Deskripsi harus diisi").trim(),
  category: z.string().min(1, "Kategori harus dipilih"),
  date: z.date({
    error: "Tanggal harus dipilih",
  }),
});

export type EditTransactionFormValues = z.infer<typeof editTransactionSchema>;