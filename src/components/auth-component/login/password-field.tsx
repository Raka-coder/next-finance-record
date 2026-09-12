"use client"

import { useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFormContext } from "react-hook-form"
import { LoginFormValues } from "@/validation/schemas/login"
import ForgotPasswordLink from "./forgot-password-link"
import { Lock, Eye, EyeOff } from "lucide-react"

export function PasswordField() {
  const { control } = useFormContext<LoginFormValues>()
  const [showPassword, setShowPassword] = useState(false)
  
  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm font-medium">Password</FormLabel>
            <ForgotPasswordLink />
          </div>
          <FormControl>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Masukkan kata sandi"
                type={showPassword ? "text" : "password"}
                className="pl-9 pr-10"
                {...field}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 size-7 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}