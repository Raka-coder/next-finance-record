import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { RegisterFormValues } from "@/validation/schemas/register"

export function EmailField() {
  const { control } = useFormContext<RegisterFormValues>()
  
  return (
    <FormField
      control={control}
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
  )
}