
import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { LoaderIcon } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {v4 as uuidv4} from 'uuid';
import { generateUploadUrl } from '@/convex/files'
import {useUploadFiles} from '@xixixao/uploadstuff/react'
import { toast, useToast } from "@/components/ui/use-toast"

const useGeneratePodcast = ({setAudio,voiceType,voicePrompt,setAudioStorageId}:GeneratePodcastProps)=>{
    const [isGenerating,setIsGenerating]=useState(false)

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const {startUpload}= useUploadFiles(generateUploadUrl)

    const getPodcastAudio =  useAction(api.openai.generateAudioAction)

    const getAudioUrl = useMutation(api.podcasts.getUrl);

    const generatePodcast = async ()=>{
      setIsGenerating(true)
      setAudio('');

      if(!voicePrompt){
        toast({
          title: "Please provide a voiceType to generate podcast",
        })
        return setIsGenerating(false)
      }

      try {
        const response = await getPodcastAudio({
            voice:voiceType,
            input:voicePrompt 
        })

        console.log('API Response:', response);

        if (!response || !(response instanceof ArrayBuffer)) {
          throw new Error("Invalid response from audio generation API");
        }


        const blob =  new Blob([response as any],{type: 'audio/mpeg'});
        const fileName = `podcast-${uuidv4()}.mp3`;
        const file = new File([blob],fileName,{type:'audio/mpeg'});

        const uploaded = await startUpload([file]);
        const storageId = (uploaded[0].response as any).storageId;

        setAudioStorageId(storageId);

        const audioUrl = await getAudioUrl({storageId})
        setAudio(audioUrl!)
        setIsGenerating(false)

        toast({
          title: "Podcast generated sucessfully",
        })
        
      } catch (error:any) {
        console.log('error creating podcast',error.message)
        toast({
          title: "Error creating podcast",
          variant:'destructive'
        })
        console.log('Error generating podcast',error.message)
        setIsGenerating(false)
      }
    }
    return {
        isGenerating,
        generatePodcast
    }
}



const GeneratePodcast = (
   props
: GeneratePodcastProps) => {
 
    const {isGenerating,generatePodcast} = useGeneratePodcast(props);
    console.log("audio",props.audio)
    return (
        <div>
           <div className="flex flex-col gap-2.5">
             <Label className="text-16 font-bold">
                AI Prompt to generate podcast
             </Label>
             <Textarea
             className=" focus-visible:ring-orange-1 focus-visible:border-none font-light "
             placeholder="Provide text to generate audio" 
             rows={5}
             value={props.voicePrompt}
             onChange={(e)=>props.setVoicePrompt(e.target.value)}
             />
             
           </div>

           <div className='mt-5 w-full max-w-[200px]'>
           <Button type="submit"
               onClick={generatePodcast}
               className="text-16 w-full focus-visible:border-none bg-orange-1 py-4 font-extrabold transition-all duration-500 hover:bg-slate-200"
              >
              { isGenerating ? <>
                 Generating
                <LoaderIcon className=" animate-spin ml-2"/>
              </> : "Generate"}
              </Button>
           </div>

           {props.audio && (
            
            <audio
            controls
            src={props.audio}
            autoPlay
            className='mt-5'
            onLoadedMetadata={(e)=>props.setAudioDuration(e.currentTarget.duration)}
            />
           )}
        </div>
    )
}

export default GeneratePodcast
