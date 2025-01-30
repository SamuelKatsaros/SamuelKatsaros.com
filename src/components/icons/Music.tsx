import type { SVGProps } from 'react'

export function Music(props: SVGProps<SVGSVGElement>) {
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
        d='M216.2 31.5a15.9 15.9 0 0 0-13.7-2.9l-120 30a16 16 0 0 0-12.1 15.5v105.7a44 44 0 1 0 16 34.2V81.9l104-26v91.9a44 44 0 1 0 16 34.2V40a16 16 0 0 0-6.2-12.5M52 232a28 28 0 1 1 28-28a28 28 0 0 1-28 28m144-32a28 28 0 1 1 28-28a28 28 0 0 1-28 28'
      />
    </svg>
  )
}
