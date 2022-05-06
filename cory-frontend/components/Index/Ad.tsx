import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ADType } from '../../utils/propsType'

export const Ad = ({ images, texts }: ADType) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setFade(false);
            if (currentIndex < images.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setCurrentIndex(0);
            }
        }, 5000);
        return () => {
            setFade(true);
            clearInterval(timer);
        }
    }, [currentIndex, images.length]);

    return (
        <div className="w-80 h-60 text-center overflow-hidden border-2 rounded-lg border-gray-200 relative">
            <a className={fade ? "animate-fadeInNoTranslate" : "opacity-0"} target="_blank" href={texts[currentIndex]} rel="noopener noreferrer">
                <Image className="rounded-sm" src={images ? process.env.NEXT_PUBLIC_API_URL + images[currentIndex] : "/images/placeholder.png"} alt="ad" width={320} height={240} />
            </a>
        </div>
    )
}