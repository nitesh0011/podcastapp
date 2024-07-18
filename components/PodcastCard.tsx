import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'
interface props{
    PodcastId: any;
    title: string;
    description: string;
    imgURL: any;

}

const PodcastCard = ({PodcastId,title,description,imgURL}:props) => {
const router = useRouter();

  const handleViews =()=>{


    router.push(`/podcast/${PodcastId}`,{
      scroll:true,
    })
  }

  return (
    <div className=' cursor-pointer'>
      <figure className='flex flex-col gap-2' onClick={handleViews}>
        <Image
         src={imgURL}
         alt={title}
         width={174}
         height={174}
         className='aspect-square h-auto object-cover w-full rounded-xl 2xl:size-[200px]'
        />
        <div className='flex flex-col'>
            <h1 className='text-16 truncate font-bold'>{title}</h1>
            <h2 className='text-12 truncate font-normal capitalize '>{description}</h2>
        </div>
      </figure>
    </div>
  )
}

export default PodcastCard
