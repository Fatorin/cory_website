import Image from 'next/image'
import { ImageURLType } from '../../utils/propsType'

export const Logo = ({ image }: ImageURLType) => {
    return (
        <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300">
            <Image src={image ? process.env.NEXT_PUBLIC_API_URL + image : "/images/placeholder.png"} alt="logo" width={1000} height={350} layout="intrinsic" quality={100} />
        </div>
    )
}