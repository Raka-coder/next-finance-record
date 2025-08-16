import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { LoginFormValues } from "@/validation/schemas/login"

export function PasswordField() {
  const { control } = useFormContext<LoginFormValues>()
  
  return (
    <FormField
      control={control}
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
  )
}