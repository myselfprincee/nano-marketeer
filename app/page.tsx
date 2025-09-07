import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
  return (
    <div>
      <Image
        src="/images/10_void_animated.gif"
        width={100}
        height={100}
        alt='bg-video'
        className='w-screen opacity-10 object-cover h-screen absolute -z-10'
      />
      {/* Add shadow overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent translate-y-40 md:translate-y-18 to-black/80 -z-5 pointer-events-none'></div>
      <div className='left-0 right-0 flex flex-col m-auto w-full justify-center items-center md:h-screen py-20 z-50'>
        <div className='text-6xl mx-5 md:mx-0 header-animation'>Turn Creativity into Conversions</div>
        <p className='md:w-2/3 text-center md:text-xl font-[Helvetica] mx-5 md:mx-0'>Nano-Marketeer helps you create stunning ad creatives with AI image generation and lets customers virtually try on your products before they buy. Boost clicks, sales, and customer trust—all in minutes.</p>
      </div>

      <div className='gap-20 flex flex-col mx-6 mt-12'>
        <h2 className='text-3xl header-animation'>Our Tools In Action</h2>
        <ul className='flex flex-col md:flex-row gap-4'>
          <Link href={"/creative-ads-maker"}>
            <li className='min-h-max h-max'>
              <div className='border border-gray-200 rounded-lg shadow-lg overflow-hidden max-w-sm bg-white hover:shadow-xl transition-shadow duration-300' id='Creative-ads-maker'>
                <Image src='/images/ads.webp' alt='creative ads' height={200} width={300} className='w-full h-48 object-cover' />
                <div className='p-4'>
                  <h3 className='text-xl font-bold mb-2 text-gray-800'>Creative Ads Maker</h3>
                  <p className='text-gray-600 text-sm leading-relaxed'>Generate scroll-stopping ads for your brand in seconds. No design team? No problem.</p>
                </div>
              </div>
            </li>
          </Link>
          <Link href={"/ai-tryon"}>
            <li className=''>
              <div className='border border-gray-200 rounded-lg shadow-lg overflow-hidden max-w-sm bg-white hover:shadow-xl transition-shadow duration-300' id='Creative-ads-maker'>
                <Image src='/images/photoshootfinal.png' alt='creative ads' height={200} width={300} className='w-full h-48 object-cover' />
                <div className='p-4'>
                  <h3 className='text-xl font-bold mb-2 text-gray-800'>Seamless AI Try-on</h3>
                  <p className='text-gray-600 text-sm leading-relaxed'>No photoshoots needed—just upload a product photo, and Nano-Marketeer generates realistic model shots.</p>
                </div>
              </div>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  )
}

export default page