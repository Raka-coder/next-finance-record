import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { LoginFormValues } from "@/validation/schemas/login"
import ForgotPasswordLink from "./forgot-password-link"

export function PasswordField() {
  const { control } = useFormContext<LoginFormValues>()
  
  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Password</FormLabel>
            <ForgotPasswordLink />
          </div>
          <FormControl>
            <Input placeholder="yourpassword" type="password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}