import { clsx, type ClassValue } from 'clsx'
import { Poppins } from 'next/font/google'
import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type PropsWithClassName<P = unknown, K = HTMLElement> = P &
  Pick<HTMLAttributes<K>, 'className'>

export const fontPoppins = Poppins({ weight: '600', subsets: ['latin'] })
