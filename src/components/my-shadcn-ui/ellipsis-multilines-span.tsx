import { cn } from '@/lib/utils'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

export default function EllipsisMultilinesSpan({
  children,
  line,
  className,
  tooltipContent,
  ...props
}: React.PropsWithChildren<
  {
    line?: 1 | 2 | 3 | 4 | 5 | 6
    tooltipContent: string
  } & React.HTMLAttributes<HTMLSpanElement>
>) {
  if (line) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span
              className={cn(`line-clamp-${line}`, className)}
              {...props}
            >
              {children}
            </span>
          </TooltipTrigger>

          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className='flex'>
            <span
              className={cn(`truncate`, className)}
              {...props}
            >
              {children}
            </span>
          </div>
        </TooltipTrigger>

        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
