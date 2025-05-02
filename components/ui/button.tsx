"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0060E6] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-cobalt text-chalk hover:bg-[#0051c4]",
        cta: "bg-cobalt text-chalk hover:bg-[#0051c4] active:scale-[0.98]",
        gradient: "bg-gradient-to-br from-[#003a8c] to-[#0051c4] text-chalk/95 font-normal hover:bg-gradient-to-br hover:from-[#003a8c] hover:to-[#0060E6] hover:shadow-sm hover:cursor-pointer active:scale-[0.98]",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-cobalt bg-transparent hover:bg-cobalt/10 text-cobalt",
        secondary: "bg-[#333333] text-chalk hover:bg-[#444444]",
        ghost: "hover:bg-cobalt/10 text-cobalt",
        link: "text-cobalt underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        md: "px-6 py-3 text-body",
        lg: "h-11 rounded-md px-8 text-subheading",
        xl: "px-10 py-4 text-subheading font-normal", // Modified for more breathing room
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
  ({ className, variant, size, ...props }, ref) => {
    const Comp = "button"
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