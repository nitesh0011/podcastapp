'use client'
import EmptyState from '@/components/EmptyState'
import LoaderSpiner from '@/components/LoaderSpiner'
import PodcastCard from '@/components/PodcastCard'
import SearchBar from '@/components/SearchBar'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Discover = ({ searchParams: { search} }: { searchParams : { search: string }}) => {

  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: search || ''  })
  return (
    <div className="flex flex-col gap-9">
      <SearchBar/>

      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-black-1">Discover</h1>
        {podcastsData ? (
          <>
            {
              podcastsData?.length > 0 ? (
                <div className="podcast_grid">
                  {podcastsData && podcastsData.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                    <PodcastCard
                      key={_id}
                      PodcastId={_id}
                      imgURL={imageUrl}
                      title={podcastTitle}
                      description={podcastDescription}
                    />
                  ))}
                </div>
              ) :
                (
                  <>
                    <EmptyState
                      title='No result found'
                    />
                  </>
                )
            }
          </>
        ) :
          (
            <>
              <LoaderSpiner />
            </>
          )}
      </div>
    </div>
  )
}

export default Discover
