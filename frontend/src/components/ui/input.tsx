import { InputHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return <input ref={ref} className={cn("h-10 w-full rounded-2xl bg-zinc-900 border border-zinc-800 px-3 text-sm outline-none focus:ring-2 ring-white/10", className)} {...props} />
})
Input.displayName = "Input"
