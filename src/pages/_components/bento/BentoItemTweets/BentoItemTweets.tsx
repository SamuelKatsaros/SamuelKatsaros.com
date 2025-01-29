import { X } from '@icons/X'
import BentoBadge from '../BentoBadge'
import TweetMarquee from '@/pages/_components/bento/BentoItemTweets/TweetMarquee'

const BentoItemTweets = () => {
  return (
    <div className='flex h-full flex-col gap-5 px-5 pb-6 pt-4 max-md:gap-8'>
      <BentoBadge
        icon={X}
        text='Latest Posts'
        className={{ component: 'w-fit' }}
      />
      <div className='flex-grow place-content-center'>
        <TweetMarquee />
      </div>
      <a
        href='https://x.com/SamuelKatsaros'
        target='_blank'
        rel='nofollow noopener noreferrer'
        className='text-sm text-slate-950 hover:underline max-sm:text-xs'
      >
        View all posts on X →
      </a>
    </div>
  )
}

export default BentoItemTweets 
