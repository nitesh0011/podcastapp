'use client'
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

export const ConvexClerkProvider =({children}:{children:React.ReactNode})=> (

    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    appearance={
      {
        layout:{
          socialButtonsVariant:'iconButton',
          logoImageUrl:'/icons/microphone.png'
        },
        variables:{
          colorBackground:'#15171c',
          colorPrimary:'',
          colorText:'white'
        }
      }
    }
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
 
);