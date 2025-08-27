import { SelectHTMLAttributes } from "react"
import { cn } from "../../lib/utils"
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props
  return <select className={cn("h-10 rounded-2xl bg-zinc-900 border border-zinc-800 px-3 text-sm", className)} {...rest} />
}
