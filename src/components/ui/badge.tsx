import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90 shadow-sm hover:shadow-md",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 shadow-sm hover:shadow-md",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-sm hover:shadow-md",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground border-current",
        gradient:
          "border-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-white [a&]:hover:from-blue-600 [a&]:hover:to-purple-700 shadow-lg hover:shadow-xl rounded-full",
        success:
          "border-transparent bg-gradient-to-r from-green-500 to-emerald-500 text-white [a&]:hover:from-green-600 [a&]:hover:to-emerald-600 shadow-lg hover:shadow-xl rounded-full",
        warning:
          "border-transparent bg-gradient-to-r from-orange-500 to-red-500 text-white [a&]:hover:from-orange-600 [a&]:hover:to-red-600 shadow-lg hover:shadow-xl rounded-full",
        premium:
          "border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white [a&]:hover:from-purple-600 [a&]:hover:via-pink-600 [a&]:hover:to-blue-600 shadow-lg hover:shadow-xl rounded-full animate-pulse",
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
