
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-md",
  {
    variants: {
      variant: {
        default: "bg-trndsky-blue text-white hover:bg-trndsky-darkblue border border-trndsky-blue/20 hover:shadow-blue-glow hover:opacity-100 active:opacity-100",
        destructive:
          "bg-trndsky-red text-white hover:bg-trndsky-red/90 border border-trndsky-red/20 hover:shadow-red-glow hover:opacity-100 active:opacity-100",
        outline:
          "border-2 border-trndsky-blue bg-transparent text-trndsky-blue hover:bg-trndsky-blue/10 hover:border-trndsky-blue hover:shadow-blue-glow hover:opacity-100 active:opacity-100",
        secondary:
          "bg-trndsky-yellow text-trndsky-darkblue hover:bg-trndsky-yellow/90 border border-trndsky-yellow/20 hover:shadow-yellow-glow hover:opacity-100 active:opacity-100",
        ghost: "hover:bg-trndsky-blue/10 hover:text-trndsky-blue border border-transparent hover:border-trndsky-blue/20 hover:opacity-100 active:opacity-100",
        link: "text-trndsky-blue underline-offset-4 hover:underline shadow-none hover:opacity-100 active:opacity-100",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3 py-2",
        lg: "h-12 rounded-lg px-8 py-3 text-base",
        xl: "h-14 rounded-lg px-10 py-3.5 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
