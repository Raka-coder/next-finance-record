import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { RegisterFormValues } from "@/validation/schemas/register"
import { Mail } from "lucide-react"

export function EmailField() {
  const { control } = useFormContext<RegisterFormValues>()
  
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">Email</FormLabel>
          <FormControl>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="nama@email.com"
                type="email"
                autoComplete="email"
                className="pl-9"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}