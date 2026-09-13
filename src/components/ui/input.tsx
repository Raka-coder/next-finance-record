import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-foreground selection:text-background border-border flex h-8 w-full min-w-0 rounded-[4px] border bg-background px-3 py-1.5 text-xs text-foreground shadow-none transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-foreground focus-visible:ring-1 focus-visible:ring-foreground",
        "aria-invalid:ring-[#F5C2C7] aria-invalid:border-[#9F2F2D]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
