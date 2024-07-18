import { v } from "convex/values";
import { action } from "./_generated/server";
import axios from 'axios';
import  { OpenAI } from 'openai';


const Url = 'https://open-ai-text-to-speech1.p.rapidapi.com/'

export const generateAudioAction = action({
  args: {
    voice: v.string(),
    input: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Starting generateAudioAction with args:", args);

    const options = {
      method: 'POST',
      url: Url,
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': 'open-ai-text-to-speech1.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        model: 'tts-1',
        input: args.input, 
        voice: args.voice
      },
      responseType: 'arraybuffer' as const
    };

    try {
      // console.log("Sending request to OpenAI API");
      const response = await axios(options);
      // console.log("Received response from OpenAI API");
      return response.data;
    } catch (error) {
      // console.error("Error in generateAudioAction:");
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
        console.error("Response headers:", error.response?.headers);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to generate audio: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }
});







export const generateImageAction = action({
  args:{prompt:v.string()},
  handler: async (ctx, args)=>{
    const options = {
      method: 'POST',
      url: 'https://ai-image-generator3.p.rapidapi.com/generate',
      headers: {
        'x-rapidapi-key':  process.env.RAPID_API_KEY,
        'x-rapidapi-host': 'ai-image-generator3.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        prompt: args.prompt,
        page: 1
      },
      responseType: 'json' as const
    };
    
    try {
      const response = await axios.request(options);
      
      // Check if the response contains the expected data
      if (response.data?.results?.images && response.data.results.images.length > 0) {
        // Return the first image URL
        return { imageUrl: response.data.results.images[0] };
      } else {
        throw new Error("No images found in the API response");
      }
    
    } catch (error:any) {
      console.error(error.message);
    }
    
  }
})