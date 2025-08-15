"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Wallet } from "lucide-react"
import { supabase } from "@/utils/supabase/client"
import { ProfileService } from "@/services/profile-service"
import { registerFormSchema, RegisterFormValues } from "@/validation/schemas/register"
import { useState } from "react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState("")

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
  })

  // Async username validation
  const validateUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameError("Username minimal 3 karakter")
      return false
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError("Username hanya boleh mengandung huruf, angka, dan underscore")
      return false
    }
    const isAvailable = await ProfileService.checkUsernameAvailability(username)
    if (!isAvailable) {
      setUsernameError("Username sudah digunakan")
      return false
    }
    setUsernameError("")
    return true
  }

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true)
    setMessage("")
    const isUsernameValid = await validateUsername(data.username)
    if (!isUsernameValid) {
      setLoading(false)
      return
    }
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          full_name: data.fullName,
        },
      },
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.message("Periksa email Anda untuk link konfirmasi!")
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-6" />
          </div>
        </div>
        <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
        <CardDescription>Daftar untuk mulai mengelola keuangan Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-[300px]">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Fullname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onBlur={async (e) => {
                        field.onBlur()
                        await validateUsername(e.target.value)
                      }}
                    />
                  </FormControl>
                  {usernameError && <p className="text-sm text-red-600">{usernameError}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" type="email" {...field} />
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
                    <Input placeholder="yourpassword" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading || !!usernameError}>
              {loading ? "Memproses..." : "Register"}
            </Button>
          </form>
        </Form>
        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${
              message.includes("error") || message.includes("Error")
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-600 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}
        <div className="mt-4 text-center text-sm">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
