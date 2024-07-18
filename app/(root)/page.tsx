"use client";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";


export default function Home() {

  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  
  return (
    <div className="flex  flex-col gap-9 mt-9 ">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-black-1">
          Trending Podcast
        </h1>
        
        <div className="podcast_grid">
        {trendingPodcasts && trendingPodcasts.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
          <PodcastCard
            key={_id}
            PodcastId={_id}
            imgURL={imageUrl}
            title={podcastTitle}
            description={podcastDescription}
          />
        ))}
        </div>
      </section>
    </div>
  );
}
