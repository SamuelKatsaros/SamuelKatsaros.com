import type { SVGProps } from 'react'

export function Send(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 24 24'
      {...props}
    >
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M22 2l-11 11m11-11L15 22l-4-9l-9-4l20-7'
      ></path>
    </svg>
  )
}
