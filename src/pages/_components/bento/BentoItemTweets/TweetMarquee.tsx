import Marquee from '@/components/ui/marquee'
import type { Tweet } from '@/pages/_components/bento/BentoItemTweets/types'
import TweetCard from '@/pages/_components/bento/BentoItemTweets/TweetCard'

const tweets: Tweet[] = [
  {
    id: '1',
    text: "Just deployed a new feature using Astro 4.0. The performance improvements are incredible! 🚀",
    author: {
      name: 'Samuel Katsaros',
      username: '@SamuelKatsaros',
      image: '/images/x/xprofile.jpeg'
    }
  },
  {
    id: '2',
    text: "📚 Quantitative reasoning is becoming second nature.",
    author: {
      name: 'Samuel Katsaros',
      username: '@SamuelKatsaros',
      image: '/images/x/xprofile.jpeg'
    }
  },
  {
    id: '3',
    text: "Building with React Server Components and loving the developer experience! ⚛️",
    author: {
      name: 'Samuel Katsaros',
      username: '@SamuelKatsaros',
      image: '/images/x/xprofile.jpeg'
    }
  },
  {
    id: '4',
    text: "My Raspberry Pi cluster is now running Kubernetes. Time for some home lab experiments! 🥧",
    author: {
      name: 'Samuel Katsaros',
      username: '@SamuelKatsaros',
      image: '/images/x/xprofile.jpeg'
    }
  }
]

const TweetMarquee = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center -translate-y-2 overflow-hidden">
      <Marquee className="[--duration:30s]">
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} {...tweet} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[var(--card-background)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[var(--card-background)]" />
    </div>
  )
}

export default TweetMarquee