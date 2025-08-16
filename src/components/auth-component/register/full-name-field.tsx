import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { RegisterFormValues } from "@/validation/schemas/register"

export function FullNameField() {
  const { control } = useFormContext<RegisterFormValues>()
  
  return (
    <FormField
      control={control}
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
  )
}