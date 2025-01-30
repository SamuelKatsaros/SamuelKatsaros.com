import { Music } from '@icons/Music'
import React from 'react'

import BentoBadge from '../BentoBadge'

interface Track {
  name: string
  artist: string
  albumArt: string
  url: string
}

interface Props {
  track: Track
}

const BentoItemAppleMusicDisplay = ({ track }: Props) => {
  return (
    <div className='relative flex h-full flex-col px-4 pb-5 pt-3'>
      <div className='flex flex-col gap-2.5'>
        <div className='w-fit'>
          <BentoBadge icon={Music} text='Recently played' />
        </div>
        <div className='flex items-center gap-4 pl-4 -mt-.5'>
          <img
            src={track.albumArt}
            alt={`${track.name} by ${track.artist}`}
            className='h-16 w-16 rounded-sm object-cover'
          />
          <div className='flex flex-col'>
            <a
              href={track.url}
              target='_blank'
              rel='nofollow noopener noreferrer'
              className='font-medium hover:underline'
            >
              {track.name}
            </a>
            <p className='text-sm text-slate-400'>{track.artist}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BentoItemAppleMusicDisplay