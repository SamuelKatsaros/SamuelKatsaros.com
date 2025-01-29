import type { SVGProps } from 'react'

export function AppleMusic(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M208.1 71.4A8 8 0 0 0 201 64l-113.7 12.3a8 8 0 0 0-7.3 8V174a32 32 0 1 0 16 27.7V127l97.7-10.5v45.6a32 32 0 1 0 16 27.7V72a7.7 7.7 0 0 0-1.6-0.6M64 224a16 16 0 1 1 16-16a16 16 0 0 1-16 16m128-32a16 16 0 1 1-16-16a16 16 0 0 1 16 16m-16-80.5L80 121.9V84.3l96-10.4Z"
      />
    </svg>
  )
}