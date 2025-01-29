import type { SVGProps } from 'react'

export function Send(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 256 256'
      {...props}
    >
      <path
        fill='currentColor'
        d='M224 48a8 8 0 0 0-11.2-7.4L40.8 120a8 8 0 0 0 0 15.2l172 79.4a8 8 0 0 0 11.2-7.4V48m-16 142.4L59.1 128 208 65.6Z'
      />
    </svg>
  )
}
