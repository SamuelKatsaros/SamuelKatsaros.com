import { cn } from '@/lib/utils'
import type { Tweet } from './types'

const TweetCard = ({ text, author }: Tweet) => {
  return (
    <figure className={cn(
      'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2',
      'border-zinc-200 bg-white/50 hover:bg-white/80',
      'dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/80'
    )}>
      <div className='flex flex-row items-center gap-2'>
        <img 
          className='rounded-full size-8 object-cover' 
          alt={author.name} 
          src={author.image} 
        />
        <div className='flex flex-col'>
          <figcaption className='text-sm font-medium'>
            {author.name}
          </figcaption>
          <p className='text-xs text-zinc-500'>
            {author.username}
          </p>
        </div>
      </div>
      <blockquote className='mt-2 text-sm text-zinc-700 dark:text-zinc-300'>
        {text}
      </blockquote>
    </figure>
  )
}

export default TweetCard 