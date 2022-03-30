import { NextPage } from "next";
import Image from 'next/image'
import { useState } from "react";
import { Layout } from "../components/Layout";
import { AppText } from "../models/apptext";

const defaultText = "常時、アイトラッキングと心拍数表記つき！寂しがり甘えたちゃん獣人エルフハーフ…あなたの一番になりたいの！ かまって！ほめて！なでてー！お仕事は甘やかされる事なのっ‼️ ゲーム、LOL、VALO、雑談、料理…(∩ˊ꒳​ˋ∩)･*ENLIFE所属！";

const photoList = [
    { key: 0, url: "/images/profile_img_0.png" },
    { key: 1, url: "/images/profile_img_1.png" },
    { key: 2, url: "/images/profile_img_2.png" }
]

const Profile: NextPage = () => {
    const [profileText, setProfileText] = useState<AppText>()
    const [photoUrl, setPhotoUrl] = useState("/images/profile_img_0.png");

    const fetchData = async () => {

    }

    const changeImage = (url: string) => {
        setPhotoUrl(url);
    }

    return (
        <Layout>
            <div className="w-full">
                <div className="pt-16 text-center">
                    <span className="md:text-8xl text-4xl px-8 border-2 rounded-2xl border-blue-500 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-900">プロフィール</span>
                </div>
                <div className="justify-center items-center text-center pt-16 md:flex md:px-24">
                    <div className="md:w-1/5">
                        <Image className="rounded-full bg-white bg-opacity-50" src={photoUrl} alt="logo" width={250} height={250} layout="intrinsic" />
                        <div>
                            {photoList.map(photo => {
                                return <input key={photo.key} className="mx-0.5" type="radio" value={photo.key} name="image_val" onClick={() => changeImage(photo.url)} defaultChecked={photo.key == 0 ? true : false} />
                            })}
                        </div>
                    </div>
                    <div className="w-11/12 md:w-4/5 pt-8 mx-auto md:mx-6">
                        <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-900">栗山こりー</span>
                        <div className="p-4 my-8 border-2 rounded-xl bg-white bg-opacity-50 border-blue-300 ring-2 ring-blue-500 text-left">
                            {profileText ? null : defaultText}
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-12"></div>
        </Layout>
    )
}

export default Profile;