import { Quote } from '@icons/Quote'
import BentoBadge from '../BentoBadge'

const BentoItemQuoteDisplay = () => {
  return (
    <div className='flex h-full flex-col gap-5 px-5 pb-6 pt-4'>
      <BentoBadge
        icon={Quote}
        text='Favorite Quote'
        className={{ component: 'w-fit' }}
      />
      <div className='flex flex-grow flex-col items-center justify-center text-center'>
        <blockquote className='text-lg font-medium text-slate-700 dark:text-slate-300'>
          "What are you afraid of losing, when nothing in the world actually belongs to you?"
        </blockquote>
        <cite className='mt-4 text-sm text-slate-500'>
          — Marcus Aurelius
        </cite>
      </div>
    </div>
  )
}

export default BentoItemQuoteDisplay 