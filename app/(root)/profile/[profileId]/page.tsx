'use client'
import EmptyState from '@/components/EmptyState';
import LoaderSpiner from '@/components/LoaderSpiner';
import PodcastCard from '@/components/PodcastCard';
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer';
import ProfileCard from '@/components/ProfileCard';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import Image from 'next/image'
import React from 'react'

const ProfilePage = ({params}:{params:{profileId:string}}) => {
  
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });

  const podcastsData:any = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: params.profileId,
  });


  if (!user || !podcastsData) return <LoaderSpiner />;

  return (
    <section className="mt-9 flex flex-col gap-5">
    <h1 className="text-20 font-bold  max-md:text-center">
        Podcaster Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>

      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold ">All Podcasts</h1>
        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData?.podcasts
              ?.slice(0, 4)
              .map((podcast:any) => (
                <PodcastCard
                  key={podcast._id}
                  imgURL={podcast.imageUrl!}
                  title={podcast.podcastTitle!}
                  description={podcast.podcastDescription}
                  PodcastId={podcast._id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>

    </section>
  )
}

export default ProfilePage
