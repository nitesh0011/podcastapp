'use client'
import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Header from './Header';


import CarouselComp from './CarouselComp';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import LoaderSpiner from './LoaderSpiner';

const RightSidebar = () => {
    const router = useRouter()
  const { user } = useUser();

  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);
  if(!topPodcasters) return <LoaderSpiner />

  return (
    <section className="right_sidebar  ">
      <div className="flex gap-4 pb-10">
        <SignedIn >

          <Link href={`/profile/${user?.id}`} className='flex gap-3 justify-between w-full '>
            <UserButton />
          
          <div className="flex w-full items-center justify-between">
            <h1 className='text-16 truncate font-semibold text-black-1'>{user?.firstName} {user?.lastName}</h1>
            <Image
              src='/icons/right-arrow.png'
              alt='right-arrow'
              width={24}
              height={24}
            />
          </div>
          </Link>
        </SignedIn>
        </div>
 
        <section className='flex flex-col gap-2'>
          <Header
            headerTitle="Fans Like You" titleClassName={''}
          />
          <CarouselComp
            fansLikeDetail={topPodcasters!}
          />
        </section>

        <section className='flex flex-col gap-8 pt-12'>
        <Header
            headerTitle="Top Podcastrs" titleClassName={''}
          />

          <div className="flex flex-col gap-6">
                {topPodcasters?.slice(0,4).map((podcaster:any) => (
                  <div
                  key={podcaster._id}
                  className="podcaster flex cursor-pointer justify-between"
                  onClick={()=> router.push(`/profile/${podcaster.clerkId}`) }
                  >
                 <figure className="flex items-center gap-2">
                    <Image
                    src={podcaster?.imageUrl}
                    alt={podcaster.name}
                    width={44}
                    height={44}
                    className=" aspect-square rounded-lg"
                    />
                    <h2 className="text-14 font-semibold text-black-1">{podcaster.name}</h2>
                 </figure>
                 <div className="flex items-center">
                  <p className="text-12 font-normal">{podcaster.totalPodcasts} podcasts</p>
                 </div>
                  
                  </div>
                ))}
          </div>
        </section>
    

    </section>
  )
}

export default RightSidebar
