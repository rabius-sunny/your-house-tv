import { cn } from '@/lib/utils';
import { Card } from './card';
import { Skeleton } from './skeleton';

export function CardSekeleton() {
  return (
    <Card className='overflow-hidden p-0'>
      <div>
        <Skeleton className='h-48 w-full' />
        <div className='p-4 space-y-3'>
          <Skeleton className='h-6 w-3/4' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-2/3' />
        </div>
      </div>
    </Card>
  );
}

export function CardsSekeleton({
  count = 8,
  className
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        className
      )}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <CardSekeleton key={idx} />
      ))}
    </div>
  );
}
