import { NextPage } from "next";
import Image from 'next/image'
import { Layout } from "../components/Layout";

const ExternalLink: NextPage = () => {
    return (
        <Layout>
            <div className="w-full">
                <div className="pt-16 text-center">
                    <span className="md:text-6xl text-4xl px-8 border-2 rounded-2xl border-blue-500 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-900">外部リンク</span>
                </div>
                <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-2 justify-center items-center">
                    <div className="flex justify-center items-center">
                        <a target="_blank" className="flex p-2 transition ease-in-out delay-150 duration-500 hover:-translate-y-1 hover:scale-110" href="https://www.twitch.tv/kuriyamacory" rel="noopener noreferrer">
                            <Image src="/images/fake_icon.svg" className="rounded-lg" alt="Twitch" height={128} width={128} layout="intrinsic" />
                        </a>
                        <div className="text-white bg-purple-400 m-1 p-4 h-32 w-3/4 flex items-center rounded-lg border-4 border-white shadow-lg">
                            Twitch配信チャンネル
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <a target="_blank" className="flex p-2 transition ease-in-out delay-150 duration-500 hover:-translate-y-1 hover:scale-110" href="https://www.youtube.com/c/kuriyamacory" rel="noopener noreferrer">
                            <Image src="/images/fake_icon.svg" className="rounded-lg" alt="Twitch" height={128} width={128} layout="intrinsic" />
                        </a >
                        <div className="text-white bg-red-600 m-1 p-4 h-32 w-3/4 flex items-center rounded-lg border-4 border-white shadow-lg">
                            YOUTUBEチャンネル
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <a target="_blank" className="flex p-2 transition ease-in-out delay-150 duration-500 hover:-translate-y-1 hover:scale-110" href="https://twitter.com/kuriyamacory" rel="noopener noreferrer" >
                            <Image src="/images/fake_icon.svg" className="rounded-lg" alt="Twitch" height={128} width={128} layout="intrinsic" />
                        </a >
                        <div className="text-white bg-sky-600 m-1 p-4 h-32 w-3/4 flex items-center rounded-lg border-4 border-white shadow-lg">
                            配信通知やこりーの日常がみれるよ！<br />
                            フォローしかないね！？
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <a target="_blank" className="flex p-2 transition ease-in-out delay-150 duration-500 hover:-translate-y-1 hover:scale-110" href="https://discord.gg/PPKDk3XDef" rel="noopener noreferrer">
                            <Image src="/images/fake_icon.svg" className="rounded-lg" alt="Twitch" height={128} width={128} layout="intrinsic" />
                        </a>
                        <div className="text-black bg-sky-200 m-1 p-4 h-32 w-3/4 flex items-center rounded-lg border-4 border-white shadow-lg">
                            配信通知やFA！サブスク限定discord配信
                        </div>
                    </div>

                    <div className="flex justify-center items-center">
                        <a target="_blank" className="flex p-2 transition ease-in-out delay-150 duration-500 hover:-translate-y-1 hover:scale-110" href="https://www.amazon.co.jp/hz/wishlist/ls/2X1950UOSLXQA" rel="noopener noreferrer">
                            <Image src="/images/fake_icon.svg" className="rounded-lg" alt="Twitch" height={128} width={128} layout="intrinsic" />
                        </a>
                        <div className="text-black bg-yellow-500 m-1 p-4 h-32 w-3/4 flex items-center rounded-lg border-4 border-white shadow-lg">
                            投下してくれたらめちゃんこよろこび・・・！<br />
                            {"るんるんでおどる・・・！✌('ω'✌ )三✌('ω')✌三( ✌'ω')✌"}
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <a target="_blank" className="flex p-2 transition ease-in-out delay-150 hover:-translate-y-2 duration-500" href="https://coryshop.booth.pm/" rel="noopener noreferrer" >
                            <Image src="/images/fake_icon.svg" className="rounded-lg" alt="Twitch" height={128} width={128} layout="intrinsic" />
                        </a >
                        <div className="text-black bg-red-400 m-1 p-4 h-32 w-3/4 flex items-center rounded-lg border-4 border-white shadow-lg">
                            グッズ！<br />
                            順次色々ボイスとかも増やしていきたいなー！<br />
                            リクエストもまってる！
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <a target="_blank" className="flex p-2 transition ease-in-out delay-150 hover:-translate-y-2 duration-500" href="https://cory.fanbox.cc/" rel="noopener noreferrer" >
                            <Image src="/images/fake_icon.svg" className="rounded-lg" alt="Twitch" height={128} width={128} layout="intrinsic" />
                        </a >
                        <div className="text-black bg-yellow-200 m-1 p-4 h-32 w-3/4 flex items-center rounded-lg border-4 border-white shadow-lg">
                            色々な特典付き支援！💎VIPバッジもここ。
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <a target="_blank" className="flex p-2 transition ease-in-out delay-150 hover:-translate-y-2 duration-500" href="https://doneru.jp/kuriyamacory/1" rel="noopener noreferrer" >
                            <Image src="/images/fake_icon.svg" className="rounded-lg" alt="Twitch" height={128} width={128} layout="intrinsic" />
                        </a >
                        <div className="text-black bg-amber-300 m-1 p-4 h-32 w-3/4 flex items-center rounded-lg border-4 border-white shadow-lg">
                            手数料がなくそのままこりーにはいる！<br />
                            生活や配信環境改善、３Dや新衣装資金にするのな～！つよつよVになる！！！
                        </div>
                    </div>
                </div >
            </div >
            <div className="py-4" />
        </Layout >
    )
}

export default ExternalLink;