import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { Label } from '@radix-ui/react-label'
import { Textarea } from './ui/textarea'
import { Loader, LoaderIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GenerateThumbnailProps } from '@/types'
import { Input } from './ui/input'
import Image from 'next/image';
import { toast } from './ui/use-toast'
import { v4 as uuidv4 } from 'uuid';
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
const GenerateThumbnail = ({ setImage, setImageStorageId, image, imagePrompt, setImagePrompt }: GenerateThumbnailProps) => {

  const imageRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getImageUrl = useMutation(api.podcasts.getUrl);

  const handleGenerateThumbnail = useAction(api.openai.generateImageAction);

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImage('');

    try {

      const file = new File([blob], fileName, { type: 'image/png' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const imageUrl = await getImageUrl({ storageId })
      setImage(imageUrl!);
      setIsImageLoading(false)

      toast({
        title: "Thumbnail generated successfully",
      })

    } catch (error: any) {
      console.log('error generating thumbnail', error.message);
      toast({
        title: "Error generating thumbnail",
        variant: 'destructive'
      })
    }
  }

  const generateImage = async () => {
    try {
      setIsGenerating(true)
      const result = await handleGenerateThumbnail({
        prompt: imagePrompt
      });

      if (result && result.imageUrl) {
        // Fetch the image as a blob
        const response = await fetch(result.imageUrl);
        const blob = await response.blob();

        await handleImage(blob, `thumbnail-${uuidv4()}`)
      }
    } catch (error: any) {
      console.log(error.message)
      toast({
        title: "Error generating thumbnail",
        description: error.message,
        variant: 'destructive'
      });
      setIsGenerating(false)
    }
    finally {
      setIsGenerating(false)
    }
  }
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();


    try {

      const files = e.target.files;
      if (!files || files.length === 0) return;
      const file = files[0];
      console.log(file)

      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });

      await handleImage(blob, file.name)

      toast({
        title: "image upload sucessfully",
        variant: "green"
      })

    } catch (error) {
      console.log(error);

      toast({
        title: "Error uploading image",
        variant: 'destructive'
      })
    }
  }

  return (
    <div>
      <div className='generate_thumbnail'>
        <Button
          type="button"
          onClick={() => setIsAiThumbnail(true)}
          className={cn('', {
            'bg-blue-500 hover:bg-blue-400': isAiThumbnail
          })}
        >

          Use AI to generate thumbnail
        </Button>
        <Button
          type='button'
          onClick={() => setIsAiThumbnail(false)}
          className={cn('', {
            'bg-blue-500 hover:bg-blue-400': !isAiThumbnail
          })}

        >
          Upload custom image
        </Button>
      </div>
      {isAiThumbnail ? (
        <>
          <div>
            <div className="mt-5 flex flex-col gap-2.5">
              <Label className="text-16 font-bold">
                AI Prompt to generate podcast image
              </Label>
              <Textarea
                className=" focus-visible:ring-orange-1 focus-visible:border-none font-light "
                placeholder="Provide text to generate audio"
                rows={5}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />

            </div>

            <div className=' w-full max-w-[200px]'>
              <Button type="submit"
                onClick={generateImage}
                className="text-16 mt-5  w-full focus-visible:border-none bg-orange-1 py-4 font-extrabold transition-all duration-500 hover:bg-slate-200"
              >
                {isGenerating ? <>
                  Generating
                  <LoaderIcon className=" animate-spin ml-2" />
                </> : "Generate"}
              </Button>
            </div>

          </div>
        </>
      ) : (
        <>
          <div className="image_div" onClick={() => imageRef?.current?.click()}>
            <Input
              type="file"
              className="hidden"
              ref={imageRef}
              onChange={(e) => uploadImage(e)}
            />
            {!isImageLoading ? (
              <Image src="/icons/arrow.png" width={40} height={40} alt="upload" />
            ) : (
              <div className="text-16 flex-center font-medium text-white-1">
                Uploading
                <Loader size={20} className="animate-spin ml-2" />
              </div>
            )}
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-12 font-bold text-orange-1">
                Click to upload
              </h2>
              <p className="text-12 font-normal text-gray-1">SVG, PNG, JPG, or GIF (max. 1080x1080px)</p>
            </div>
          </div>
        </>
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={200}
            height={200}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
    </div>
  )
}

export default GenerateThumbnail
