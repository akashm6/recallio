import { HTMLAttributes } from "react"
import { cn } from "../../lib/utils"
export function Badge(props: HTMLAttributes<HTMLSpanElement>) {
  const { className, ...rest } = props
  return <span className={cn("inline-flex items-center rounded-full border border-zinc-700/80 bg-zinc-900 px-2.5 py-1 text-xs", className)} {...rest} />
}
