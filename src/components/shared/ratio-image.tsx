import type { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image, { type ImageProps } from 'next/image'

import { cn } from '@/lib/utils'

export default function RatioImage({
  nullableSrc,
  alt,
  sizes,
  className,
  placeholder,
  blurDataURL,
  ratio,
  useFallback = true,
  fallback = <span className='text-center italic text-gray-500'>no image</span>,
}: {
  nullableSrc: string | StaticImport | undefined | null
  ratio?: 'aspect-video' | 'aspect-square' | 'aspect-[16/10]' | 'aspect-[1/1]'
  useFallback?: boolean
  fallback?: React.ReactNode
} & Omit<ImageProps, 'src'>) {
  if (nullableSrc) {
    return (
      <div className={cn('relative', ratio ? ratio : 'aspect-video')}>
        <Image
          src={nullableSrc}
          alt={alt}
          sizes={sizes}
          fill
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={cn(className ? className : `rounded-md object-contain`)}
        />
      </div>
    )
  } else if (useFallback) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center',
          ratio ? ratio : 'aspect-video',
        )}
      >
        {fallback}
      </div>
    )
  } else {
    return null
  }
}
