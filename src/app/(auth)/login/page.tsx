"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { supabase } from "@/utils/supabase/client"
import { Wallet } from "lucide-react"
import { loginFormSchema, type LoginFormValues } from "@/validation/schemas/login"

export default function MasukPage() {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const {
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: LoginFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      form.setError("root", {
        message: error.message,
      })
    } else {
      router.push("/dashboard?success=1")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-6" />
          </div>
        </div>
        <CardTitle className="text-2xl">Masuk ke Akun</CardTitle>
        <CardDescription>Masukkan email dan password untuk masuk</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-[260px]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="your@email.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="yourpassword"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Login"}
            </Button>
          </form>
        </Form>

        {form.formState.errors.root && (
          <div className="mt-4 p-3 rounded-md text-sm bg-red-50 text-red-600 border border-red-200">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="mt-4 text-center text-sm">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
