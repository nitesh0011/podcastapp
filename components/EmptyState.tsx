import { EmptyStateProps } from '@/types'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const EmptyState = ({
  title,
  search,
  buttonLink,
  buttonText}
  :EmptyStateProps) => {
  return (
    <section className="flex-center size-full flex-col gap-3">
      <Image
       src="/icons/empty.png"
       width={250}
       height={250}
       alt='empty state'
      />

      <div className='flex-center w-ful max-w-[254px] flex-col gap-3'>
        <h1 className='flex-16 text-center font-medium text-black-1'>{title}</h1>
        {search && (
          <p className="text-16 text-center font-medium text-black-2">Try adjusting your search to find what you are looking for</p>
        )}

         {buttonLink && (
          <Button className="bg-orange-1 hover:bg-orange-300">
            <Link href={buttonLink} className="gap-1 flex">
              <Image 
                src="/icons/discovery.png"
                width={20}
                height={20}
                alt='discover'
              />
              <h1 className="text-16 font-extrabold text-black-1">{buttonText}</h1>
            </Link>
          </Button>
        )}
        
      </div>
    </section>
  )
}

export default EmptyState
