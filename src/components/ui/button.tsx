import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] text-xs font-medium transition-colors active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary",
        destructive:
          "bg-[#FDEBEC] text-[#9F2F2D] dark:bg-[#3D1D1D] dark:text-[#F87171] border border-[#F5C2C7] dark:border-[#5C2323] hover:bg-[#F8D7DA]",
        outline:
          "border border-border bg-card text-foreground hover:bg-muted/60 dark:hover:bg-muted/40",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-muted border border-border/80",
        ghost:
          "hover:bg-muted/70 text-foreground dark:hover:bg-muted/50",
        link: "text-foreground underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-8 px-3.5 py-1.5 has-[>svg]:px-2.5",
        sm: "h-7 rounded-[4px] gap-1 px-2.5 text-[11px] has-[>svg]:px-2",
        lg: "h-9 rounded-[5px] px-4 text-xs has-[>svg]:px-3",
        icon: "size-8 rounded-[5px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
