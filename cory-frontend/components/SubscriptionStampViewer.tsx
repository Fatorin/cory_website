import { useRef, useState } from "react";
import Image from 'next/image'
import { StampType } from "../utils/propsType";

const SubscriptionStampViewer = ({ emotes, badges }: StampType) => {
    const [toggle, setToggle] = useState(true);
    const scrollView = useRef<HTMLDivElement>(null);

    const SetView = (tg: boolean) => {
        setToggle(tg);
        if (scrollView.current) {
            scrollView.current.scrollTop = 0;
        }
    }

    const StampViewer = () => {
        return (
            <>
                <div className="border-y-2 border-cyan-300 bg-gradient-to-l from-cyan-200 to-cyan-300 mb-2">Follower フォロワー</div>
                <div className="flex flex-row flex-wrap items-center justify-around mb-2">
                    {emotes.find(v => v.tier == 0)?.datas.map(e => {
                        return <div key={e.name} className="px-2 py-1 basis-1/3">
                            <Image src={e.url} title={e.name} alt={e.name} width={64} height={64} layout="intrinsic" quality="100" priority={true} />
                        </div>
                    })}
                </div>
                <div className="border-y-2 border-cyan-300 bg-gradient-to-l from-cyan-200 to-cyan-300 mb-2">Tier ティア 1</div>
                <div className="flex flex-row flex-wrap items-center justify-around mb-2">
                    {emotes.find(v => v.tier == 1)?.datas.map(e => {
                        return <div key={e.name} className="px-2 py-1 basis-1/4">
                            <Image src={e.url} title={e.name} alt={e.name} width={64} height={64} layout="intrinsic" quality="100" priority={true} />
                        </div>
                    })}
                </div>
                <div className="border-y-2 border-cyan-300 bg-gradient-to-l from-cyan-200 to-cyan-300 mb-2">Tier ティア 2</div>
                <div className="flex flex-row flex-wrap items-center justify-around mb-2">
                    {emotes.find(v => v.tier == 2)?.datas.map(e => {
                        return <div key={e.name} className="px-2 py-1 basis-1/3">
                            <Image src={e.url} title={e.name} alt={e.name} width={64} height={64} layout="intrinsic" quality="100" priority={true} />
                        </div>
                    })}
                </div>
                <div className="border-y-2 border-cyan-300 bg-gradient-to-l from-cyan-200 to-cyan-300 mb-2">Tier ティア 3</div>
                <div className="flex flex-row flex-wrap items-center justify-around mb-2">
                    {emotes.find(v => v.tier == 3)?.datas.map(e => {
                        return <div key={e.name} className="px-2 py-1 basis-1/3">
                            <Image src={e.url} title={e.name} alt={e.name} width={64} height={64} layout="intrinsic" quality="100" priority={true} />
                        </div>
                    })}
                </div>
                <div className="border-y-2 border-cyan-300 bg-gradient-to-l from-cyan-200 to-cyan-300 mb-2">Bits ビッツ</div>
                <div className="flex flex-row flex-wrap items-center justify-around mb-2">
                    {emotes.find(v => v.tier == 4)?.datas.map(e => {
                        return <div key={e.name} className="px-2 py-1 basis-1/4">
                            <Image src={e.url} title={e.name} alt={e.name} width={64} height={64} layout="intrinsic" quality="100" priority={true} />
                        </div>
                    })}
                </div>
            </>
        )
    }

    const BadgeViewer = () => {
        return (
            <>
                <div className="border-cyan-300 bg-gradient-to-l from-cyan-200 to-cyan-300 mb-2"></div>
                <div className="flex flex-row flex-wrap items-center justify-around mb-2">
                    {badges.map(e => {
                        return <div key={e.name} className="px-2 py-1 basis-1/3">
                            <Image src={e.url} title={e.name} alt={e.name} width={64} height={64} layout="intrinsic" quality="100" priority={true} />
                            <div>{e.name} 月</div>
                        </div>
                    })}
                </div>
            </>
        )
    }

    return (
        <div className="md:w-80 h-60 px-2">
            <div ref={scrollView} className="border-2 rounded-t-2xl h-5/6 close-scrollbar overflow-auto bg-gradient-to-b from-white to-cyan-300">
                {toggle ? <StampViewer /> : <BadgeViewer />}
            </div>
            <div className="h-1/6 rounded-lg flex">
                <button className={`w-1/2 h-full rounded-bl-lg text-white ${toggle ? "bg-purple-600" : "bg-purple-300"} hover:bg-purple-500 active:bg-purple-900`} disabled={toggle} onClick={e => SetView(true)}>☆サブスクスタンプ</button>
                <button className={`w-1/2 h-full rounded-br-lg text-white ${toggle ? "bg-red-300" : "bg-red-600"} hover:bg-red-600 active:bg-red-900`} disabled={!toggle} onClick={e => SetView(false)}>⊕バッジ</button>
            </div>
        </div >
    )
}

export default SubscriptionStampViewer;