'use client'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/useDebounce'

const SearchBar = () => {
  const [search ,setSearch]=useState('');
  const router = useRouter(); 
  const pathname = usePathname();

  const debounceValue = useDebounce(search,500);


  useEffect(() => {
    if(debounceValue) {
      router.push(`/discover?search=${debounceValue}`)
    } else if ( !debounceValue && pathname === '/discover') router.push('/discover')
  }, [router, pathname, debounceValue])

  
  return (
    <div className='relative mt-8 block '>
      <Input
       className='py-6 pl-6  '
       
       placeholder='Search for podcasts'
       value={search}
       onChange={(e)=> setSearch(e.target.value)}
       onLoad={()=> setSearch('')}
      />


     
      <Image
      alt='search'
      src='/icons/search.png'
      height={42}
      width={42}
      className='absolute right-3 top-1.5  border-l-2 border-slate-300 pl-1 '
      />

    </div>
  )
}

export default SearchBar
