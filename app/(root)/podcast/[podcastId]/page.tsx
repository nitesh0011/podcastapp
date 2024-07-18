'use client'
import EmptyState from '@/components/EmptyState'
import LoaderSpiner from '@/components/LoaderSpiner'
import PodcastCard from '@/components/PodcastCard'
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import React from 'react'

const PostcastDetails = ({params}:{params:{podcastId:Id<'podcasts'>}}) => {
  const { user } = useUser();

  const podcast:any = useQuery(api.podcasts.getPodcastById,{podcastId:params.podcastId});

  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType,{podcastId:params.podcastId});

  const isOwner = user?.id === podcast?.authorId;


  if(!similarPodcasts || !podcast) return <LoaderSpiner/>
  return (
 <section className="flex w-full flex-col">
   <header className="mt-9 flex items-center justify-between">
      <h1 className="text-20 font-bold">
        Currently Playing
      </h1>

      <figure className="flex gap-3">
         <Image
          src='/icons/headphone.png'
          width={24}
          height={24}
          alt='headphone'
         />

         <h2 className="text-16 font-bold">{podcast?.views}</h2>
      </figure>
   </header>

   <PodcastDetailPlayer
   isOwner={isOwner}
   podcastId={podcast._id}
   {...podcast}
   />

   <p className="text-16 pb-8 pt-[45px] font-medium max:text-center">{podcast?.podcastDescription}</p>

   <div className="flex flex-col gap-8">
    <div className="flex flex-col gap-4">
     <h1 className="text-18 font-bold ">Transcription</h1>
     <p className="text-16 font-medium text-black-2">{podcast?.voicePrompt}</p>
    </div>

    <div className="flex flex-col gap-4">
     <h1 className="text-18 font-bold ">Thumbnail Prompt</h1>
     <p className="text-16 font-medium text-black-2">{podcast?.imagePrompt}</p>
    </div>


   </div>

   

   <section className='mt-8 flex flex-col gap-5'>
    <h1 className="text-20 font-bold text-black-1">Similar Podcasts</h1>
    {similarPodcasts && similarPodcasts.length > 0 ? (
      <div className="podcast_grid">
      {similarPodcasts && similarPodcasts.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
        <PodcastCard
          key={_id}
          PodcastId={_id}
          imgURL={imageUrl}
          title={podcastTitle}
          description={podcastDescription}
        />
      ))}
      </div>
    ):
    (
      <>
         <EmptyState
            title="No similar podcasts found"
            buttonLink="/discover"
            buttonText="Discover more podcasts"
          />
      </>
    )
  }
    
   </section>

 </section>
  )
}

export default PostcastDetails
