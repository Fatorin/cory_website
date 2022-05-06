import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Avatar } from '../components/Index/Avatar'
import { LinkBar } from '../components/Index/LinkBar'
import { Layout } from '../components/Layout'
import { axiosInstance } from '../utils/api'
import { HOME_COMPONENT_AD, HOME_COMPONENT_AVATAR, HOME_COMPONENT_LOGO } from '../utils/commonTextSetting'
import { ComponentModel } from '../models/component'
import { Logo } from '../components/Index/Logo'
import { EmoteDatas, InfoData } from '../models/infoData'
import { Ad } from '../components/Index/Ad'
import SubscriptionStampViewer from '../components/SubscriptionStampViewer'

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ logo, avatar, ad, emotes, badges }) => {
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
      <div className="flex justify-center items-end">
        <div className="px-4 pt-4 md:p-0 md:mb-16">
          <Logo image={logo.image} />
          <LinkBar />
          <div className="mt-4 gap-4 md:flex md:justify-center items-center">
            <Ad images={ad.image.split(',')} texts={ad.text.split(',')} />
            <SubscriptionStampViewer emotes={emotes} badges={badges} />
          </div>
        </div>
        <Avatar image={avatar.image} />
      </div>
    )
  }

  const MobileIndex = () => {
    return (
      <div className="justify-center items-end">
        <div className="px-4 pt-4 md:p-0 md:mb-16">
          <Logo image={logo.image} />
        </div>
        <Avatar image={avatar.image} />
        <LinkBar />
        <div className="mt-4 gap-4 flex flex-col md:justify-center items-center">
          <Ad images={ad.image.split(',')} texts={ad.text.split(',')} />
          <SubscriptionStampViewer emotes={emotes} badges={badges} />
          <div className="py-8"></div>
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

export default Home;

export const getStaticProps: GetStaticProps<{ logo: ComponentModel, avatar: ComponentModel, ad: ComponentModel, emotes: EmoteDatas[], badges: InfoData[] }> = async () => {
  try {
    const logoRes = await axiosInstance.get("components", { params: { type: HOME_COMPONENT_LOGO } });
    const logo = logoRes.data as ComponentModel;

    const avatarRes = await axiosInstance.get("components", { params: { type: HOME_COMPONENT_AVATAR } });
    const avatar = avatarRes.data as ComponentModel;

    const adRes = await axiosInstance.get("components", { params: { type: HOME_COMPONENT_AD } });
    const ad = adRes.data as ComponentModel;

    const emotesRes = await axiosInstance.get("twitch/emotes");
    const emotes = emotesRes.data as EmoteDatas[];

    const badgesRes = await axiosInstance.get("twitch/badges");
    const badgesSource = badgesRes.data as InfoData[];
    const badges = badgesSource.filter(v => parseInt(v.name, 10) < 100).sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));

    return {
      props: {
        logo, avatar, ad, emotes, badges
      },
      revalidate: 30
    }
  } catch {
    return {
      notFound: true
    }
  }
};