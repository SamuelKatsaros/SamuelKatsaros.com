import React from 'react'

import { cn } from '@/lib/utils'

interface Props {
  src: string
  poster?: string
}

const TweetVideo = ({ src, poster }: Props) => {
  return (
    <div className='relative'>
      <video
        className='max-h-[640px] rounded-lg border border-zinc-200 drop-shadow-sm'
        height='640px'
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={src} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default TweetVideo
