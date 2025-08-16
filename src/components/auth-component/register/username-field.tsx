import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { RegisterFormValues } from "@/validation/schemas/register"

export function UsernameField() {
  const { control } = useFormContext<RegisterFormValues>()

  return (
    <FormField
      control={control}
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
                // Validasi akan dilakukan di komponen parent
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}