import { cva } from 'class-variance-authority'
import React from 'react'

import { cn } from '@/lib/utils'

interface CustomClass {
  component?: string
  icon?: string
}

interface Props {
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  text?: string
  className?: CustomClass
}

const badgeVariants = cva(
  'z-10 flex items-center gap-2 rounded-full border border-slate-200 bg-white shrink-0 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'py-2 pl-3 pr-4 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:border-sky-200',
        iconOnly: 'p-2 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:border-sky-200'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const BentoBadge = ({ icon: Icon, text, className }: Props) => {
  const variant = text ? 'default' : 'iconOnly'

  return (
    <div
      className={cn(
        badgeVariants({ variant, className: className?.component })
      )}
    >
      <Icon className={cn('size-4', className?.icon)} />
      {!!text && <h3 className='text-sm text-slate-800'>{text}</h3>}
    </div>
  )
}

export default BentoBadge
