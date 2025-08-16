import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { RegisterFormValues } from "@/validation/schemas/register"

export function PasswordField() {
  const { control } = useFormContext<RegisterFormValues>()
  
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