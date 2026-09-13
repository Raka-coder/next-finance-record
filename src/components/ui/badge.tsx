import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-mono font-medium uppercase tracking-[0.05em] w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-border bg-secondary text-foreground",
        secondary:
          "border-border/80 bg-muted/60 text-muted-foreground",
        destructive:
          "border-[#F5C2C7] bg-[#FDEBEC] text-[#9F2F2D] dark:border-[#5C2323] dark:bg-[#321B1B] dark:text-[#F87171]",
        outline:
          "border-border text-foreground bg-transparent",
        success:
          "border-[#D0E6CD] bg-[#EDF3EC] text-[#346538] dark:border-[#224424] dark:bg-[#1A2E1C] dark:text-[#81C784]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
