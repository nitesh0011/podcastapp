"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import GeneratePodcast from "@/components/GeneratePodcast"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { LoaderIcon } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/components/ui/use-toast"
import { mutation } from "@/convex/_generated/server"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"










const voiceCategories = ['alloy', 'shimmer', 'nova', 'echo', 'fable', 'onyx'];

const formSchema = z.object({
  podcastTitle: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  podcastDescription: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
})

const CreatePodcast = () => {
  const router = useRouter()
  const [voiceType, setVoiceType] = useState<string | null>(null);
  const [voicePrompt,setVoicePrompt] = useState('');

  const [imageUrl,setImageUrl] = useState('');
  const [imagePrompt,setImagePrompt] = useState('');
  const [imageStorageId,setImageStorageId] = useState<Id<"_storage"> | null>(null);
  
  const [audioUrl,setAudioUrl] = useState('');
  const [audioStorageId,setAudioStorageId] = useState<Id<"_storage"> | null>(null);
  const [audioDuration,setAudioDuration] = useState(0);
  
  const [isSubmitting,setIsSubmitting] = useState(false);

  const createPodcast = useMutation(api.podcasts.createPodcast)

  const {toast} = useToast()


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  })


  async function onSubmit(data: z.infer<typeof formSchema>) {

    try {
      setIsSubmitting(true)

      if(!audioUrl || !imageUrl || !voiceType){
        toast({
          title: "Please generate audio and image",
        })
        setIsSubmitting(false)
        throw new Error("please generate audio and image")
      }

      const podcast = await createPodcast ({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioUrl,
        imageUrl,
        voiceType,
        imagePrompt,
        voicePrompt,
        views:0,
        audioDuration,
        audioStorageId:audioStorageId!,
        imageStorageId:imageStorageId!

      })
      toast({
        title: "Podcast created",
        
      })
      setIsSubmitting(false)

      router.push('/')
    } catch (error:any) {
      console.log(error.message)
      toast({
        title: "Error",
        variant:"destructive"
      })
      setIsSubmitting(false)
    }

  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className=" font-bold text-20 mt-9 "> Create podcast</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">

          <div className="flex flex-col gap-[30px] pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5 ">
                  <FormLabel className="text-16 font-bold">Podcast Title</FormLabel>
                  <FormControl className="focus-visible:border-none focus-visible:ring-orange-1">
                    <Input placeholder="Your Podcast Title.." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="flex flex-col gap-2.5">
              <FormLabel className="text-16 font-bold">
                Select AI Voice
              </FormLabel>

              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger className={cn('text-16 w-full border-none ')}>
                  <SelectValue placeholder="Select Voice" />
                </SelectTrigger>
                <SelectContent>
                  {voiceCategories.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize focus:bg-orange-1">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
                {voiceType && (
                  <audio
                    src={`/${voiceType}.mp3`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>


            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5 ">
                  <FormLabel className="text-16 font-bold">Description</FormLabel>
                  <FormControl className="focus-visible:border-none focus-visible:ring-orange-1">
                    <Textarea placeholder="Write a short podcast description.." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

          </div>

          <div className="flex flex-col pt-10">
            <GeneratePodcast
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voiceType={voiceType!}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration} 
              voices={undefined}            />

            <GenerateThumbnail
             setImage={setImageUrl}
             setImageStorageId={setImageStorageId}
             image={imageUrl}
             imagePrompt={imagePrompt}
             setImagePrompt={setImagePrompt}
            />

            <div className="mt-10 w-full">
              <Button type="submit"
               className="text-16 w-full focus-visible:border-none bg-orange-1 py-4 font-extrabold transition-all duration-500 hover:bg-slate-200"
              >
              { isSubmitting ? <>
                 Submitting
                <LoaderIcon className=" animate-spin ml-2"/>
              </> : "Submit & Publish Podcast"}
              </Button>
            </div>

          </div>



        </form>
      </Form>
    </section>
  )
}


export default CreatePodcast