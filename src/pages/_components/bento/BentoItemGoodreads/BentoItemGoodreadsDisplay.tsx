import { Book } from '@icons/Book'
import React from 'react'

import BentoBadge from '../BentoBadge'

interface BookData {
  title: string
  author: string
  coverUrl: string
  bookUrl: string
}

interface Props {
  books: BookData[]
}

const BentoItemGoodreadsDisplay = ({ books }: Props) => {
  return (
    <div className='relative flex h-full flex-col justify-between px-4 pb-5 pt-4 max-md:gap-4'>
      <div className='flex items-baseline justify-between gap-4 max-xs:flex-col'>
        <BentoBadge icon={Book} text='Recent reads' />
      </div>
      <div className='grid grid-cols-4 gap-2 overflow-hidden'>
        {books.slice(0, 8).map((book, i) => (
          <a
            key={i}
            href={book.bookUrl}
            target='_blank'
            rel='nofollow noopener noreferrer'
            className='transition-transform hover:scale-105'
          >
            <img
              src={book.coverUrl}
              alt={`${book.title} by ${book.author}`}
              className='h-[150px] w-[100px] rounded object-cover'
            />
          </a>
        ))}
      </div>
      <a
        href='https://www.goodreads.com/user/show/175859988-samuel-katsaros'
        target='_blank'
        rel='nofollow noopener noreferrer'
        className='text-sm text-slate-950 hover:underline max-sm:text-xs'
      >
        View all books on Goodreads →
      </a>
    </div>
  )
}

export default BentoItemGoodreadsDisplay
