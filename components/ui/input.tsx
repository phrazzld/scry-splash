"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional class name for styling override
   */
  className?: string
  
  /**
   * Input container class name
   */
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, type, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col w-full", containerClassName)}>
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-md border-2 border-foreground/40 bg-background px-5 py-3 text-base",
            "text-foreground focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }