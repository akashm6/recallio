import { HTMLAttributes } from "react"
import { cn } from "../../lib/utils"
export function Card(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return <div className={cn("rounded-3xl border border-zinc-800/70 bg-zinc-950/60 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,.03)]", className)} {...rest} />
}
export function CardBody(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return <div className={cn("p-5 md:p-6", className)} {...rest} />
}
export function CardHeader(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return <div className={cn("px-5 md:px-6 pt-5 md:pt-6 pb-2", className)} {...rest} />
}
export function CardTitle(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return <div className={cn("text-base md:text-lg font-semibold", className)} {...rest} />
}
