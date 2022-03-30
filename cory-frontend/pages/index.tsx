import type { NextPage } from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import SubscriptionStampViewer from '../components/SubscriptionStampViewer'

const LinkBar = () => {
  return (
    <>
      <div className="justify-center items-center flex flex-wrap gap-4">
        <a target="_blank" href="https://www.twitch.tv/kuriyamacory" rel="noopener noreferrer">
          <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500 px-4 rounded-lg border-2 border-blue-200 bg-purple-400 ring-2 ring-purple-900 font-bold hover:text-white">
            Twitch
          </div>
        </a>
        <a target="_blank" href="https://www.youtube.com/c/kuriyamacory" rel="noopener noreferrer">
          <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500 px-4 rounded-lg border-2 border-blue-200 bg-red-600 ring-2 ring-red-900 hover:text-white">
            Youtube
          </div>
        </a>
        <a target="_blank" href="https://twitter.com/kuriyamacory" rel="noopener noreferrer">
          <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500 px-4 rounded-lg border-2 border-blue-200 bg-blue-600 ring-2 ring-blue-900 font-bold hover:text-white">
            Twitter
          </div>
        </a>
        <a target="_blank" href="https://coryshop.booth.pm/" rel="noopener noreferrer">
          <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500 px-4 rounded-lg border-2 border-blue-200 bg-red-500 ring-2 ring-red-900 font-bold hover:text-white">
            BOOTH
          </div>
        </a>
        <a target="_blank" href="https://cory.fanbox.cc/" rel="noopener noreferrer">
          <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500 px-4 rounded-lg border-2 border-blue-200 bg-yellow-400 ring-2 ring-yellow-900 font-bold hover:text-white">
            FANBOX
          </div>
        </a>
      </div><div className="mt-4 gap-4 md:flex md:justify-center items-center">
        <div className="text-center">
          <a target="_blank" href="https://store.line.me/stickershop/product/16299488" rel="noopener noreferrer">
            <Image src="/images/line_stamp.jpg" alt="logo" width={320} height={240} layout="intrinsic" />
          </a>
        </div>
        <div className="text-center">
          <SubscriptionStampViewer />
        </div>
        <div className="py-8"></div>
      </div>
    </>
  )
}

const Home: NextPage = () => {
  const [mobileStyle, setMobileStyle] = useState(true);

  const handleResize = () => {
    if (window.innerWidth > 767) {
      setMobileStyle(true);
    } else if (window.innerWidth < 767) {
      setMobileStyle(false);
    }
  }

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  const Index = () => {
    return (
      < div className="w-full" >
        <div className="justify-center items-end md:flex">
          <div className="px-4 pt-4 md:p-0 md:mb-16">
            <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500">
              <Image src="/images/logo.png" alt="logo" width={750} height={264} layout="intrinsic" />
            </div>
            <LinkBar />
          </div>
          <div className="text-center">
            <Image src="/images/cory_avatar.png" alt="avatar" width={666} height={850} layout="intrinsic" />
          </div>
        </div>
      </div >
    )
  }

  const MobileIndex = () => {
    return (
      <div className="w-full">
        <div className="justify-center items-end md:flex">
          <div className="px-4 pt-4 md:p-0 md:mb-16">
            <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500">
              <Image src="/images/logo.png" alt="logo" width={750} height={264} layout="intrinsic" />
            </div>
          </div>
          <div className="text-center">
            <Image src="/images/cory_avatar.png" alt="avatar" width={666} height={850} layout="intrinsic" />
          </div>
          <LinkBar />
        </div>
      </div>
    )
  }

  return (
    <Layout>
      {!mobileStyle ? <MobileIndex /> : <Index />}
    </Layout>
  )
}

export default Home
