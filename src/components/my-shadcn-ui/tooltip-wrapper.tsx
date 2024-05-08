import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

export function TooltipWrapper({
  children,
  tooltipContent,
  asChild = true,
  align = 'start',
}: React.PropsWithChildren<{
  tooltipContent: string | undefined | null
  asChild?: boolean
  align?: 'center' | 'end' | 'start'
}>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        {tooltipContent && (
          <TooltipContent align={align}>
            <p>{tooltipContent}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
