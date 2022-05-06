import Image from 'next/image'
import { useEffect, useState } from "react";
import { ImageURLType } from '../../utils/propsType';

const handleUrls = (urlSource: string) => {
    const urls = urlSource.split(",");
    return urls;
}

export const Avatar = ({ image }: ImageURLType) => {
    const [index, setIndex] = useState(0);
    const [urls, setUrls] = useState<string[]>(handleUrls(image));
    const [fade, setFade] = useState(false);

    const prev = () => {
        setFade(false);
        if (index > 0) {
            setIndex(index - 1);
        } else {
            setIndex(urls.length - 1);
        }
    }

    const next = () => {
        setFade(false);
        if (index < urls.length - 1) {
            setIndex(index + 1);
        } else {
            setIndex(0);
        }
    }

    useEffect(() => {
        setFade(true);
    }, [index])

    return (
        <div className="flex justify-center items-center lg:p-0">
            <button className="mx-1 text-white shadow-lg border-2 rounded-full hover:text-orange-300 hover:border-orange-300" onClick={prev}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className={fade ? "animate-fadeInNoTranslate" : "opacity-0"}>
                <Image src={urls.length !== 0 ? process.env.NEXT_PUBLIC_API_URL + urls[index] : "/images/placeholder.png"} alt="avatar" width={720} height={900} layout="intrinsic" quality={100} priority={true} />
            </div>
            <button className="mx-1 text-white shadow-lg border-2 rounded-full hover:text-orange-300 hover:border-orange-300" onClick={next}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    )
}