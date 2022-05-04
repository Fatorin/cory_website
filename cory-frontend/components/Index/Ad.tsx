import Image from 'next/image'
import { LinkBarType } from '../../utils/propsType'
import SubscriptionStampViewer from '../SubscriptionStampViewer'

export const Ad = ({ image, emotes, badges }: LinkBarType) => {
    return (
        <div className="mt-4 gap-4 md:flex md:justify-center items-center">
            <div className="text-center">
                <a target="_blank" href="https://store.line.me/stickershop/product/16299488" rel="noopener noreferrer">
                    <Image src={image ? process.env.NEXT_PUBLIC_API_URL + image : "/images/placeholder.png"} alt="ad" width={320} height={240} layout="intrinsic" />
                </a>
            </div>
            <div className="text-center">
                <SubscriptionStampViewer emotes={emotes} badges={badges} />
            </div>
            <div className="py-8"></div>
        </div>
    )
}