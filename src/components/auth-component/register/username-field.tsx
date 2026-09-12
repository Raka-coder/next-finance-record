import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { RegisterFormValues } from "@/validation/schemas/register"
import { AtSign } from "lucide-react"

export function UsernameField() {
  const { control } = useFormContext<RegisterFormValues>()

  return (
    <FormField
      control={control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">Username</FormLabel>
          <FormControl>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="johndoe"
                className="pl-9"
                {...field}
                onBlur={async () => {
                  field.onBlur()
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}