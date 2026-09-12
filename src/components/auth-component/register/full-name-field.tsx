import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { RegisterFormValues } from "@/validation/schemas/register"
import { User } from "lucide-react"

export function FullNameField() {
  const { control } = useFormContext<RegisterFormValues>()
  
  return (
    <FormField
      control={control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">Nama Lengkap</FormLabel>
          <FormControl>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input placeholder="John Doe" className="pl-9" {...field} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}