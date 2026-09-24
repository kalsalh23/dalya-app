import { cn } from '../../lib/utils'

export function Spinner({ size = 28, light = false, fullscreen = false, className }) {
  const spinner = (
    <div
      style={{ width: size, height: size }}
      className={cn(
        'animate-spin rounded-full border-[3px]',
        light ? 'border-white/30 border-t-white' : 'border-plum/20 border-t-plum',
        className
      )}
    />
  )
  if (fullscreen) {
    return <div className="flex min-h-[60vh] items-center justify-center">{spinner}</div>
  }
  return spinner
}

export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />
}

export function CardSkeletonGrid({ count = 4, cols = 'grid-cols-2 lg:grid-cols-4' }) {
  return (
    <div className={cn('grid gap-4', cols)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden !rounded-3xl">
          <Skeleton className="aspect-[4/3] w-full !rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-3 w-2/3 !rounded-full" />
            <Skeleton className="h-3 w-1/3 !rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
