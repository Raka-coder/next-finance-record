import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-border placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-1 focus-visible:ring-foreground flex min-h-16 w-full rounded-[4px] border bg-background px-3 py-2 text-xs leading-relaxed shadow-none transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
