import { url } from "inspector";
import { NextPage } from "next";
import Image from 'next/image'
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { AppText } from "../models/apptext";
import { ComponentModel } from "../models/component";
import { Language } from "../models/language";
import { axiosInstance } from "../utils/api";
import { AppTextSetting, APP_TEXT_PROFILE, PROFILE_COMPONENT_ICON } from "../utils/commonTextSetting";

const Profile: NextPage = () => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [appTexts, setAppTexts] = useState<AppText[]>([]);
    const [defaultLang, setDefaultLang] = useState("");
    const [urls, setUrls] = useState<string[]>([]);
    const [imageUrl, setImageURL] = useState("");

    useEffect(() => {
        const getLanguages = async () => {
            await axiosInstance.get('languages')
                .then(({ data }) => {
                    filterLanguage(data);
                })
                .catch((e) => {
                    console.log("Error");
                })
        }

        const filterLanguage = (data: Language[]) => {
            const langs = data.filter(v => v.available != false);
            setLanguages(langs);
            setDefaultLang(langs[0].id.toString());
        }

        const fetchData = async () => {
            await axiosInstance.get("components", { params: { type: PROFILE_COMPONENT_ICON } })
                .then(({ data }) => {
                    handleUrls(data);
                })
                .catch((e) => {
                    console.log(e);
                })
        }

        const handleUrls = (data: ComponentModel) => {
            const urls = data.image.split(",");
            if (urls) {
                setUrls(urls);
                setImageURL(urls[0]);
            }
        }

        getLanguages();
        fetchData();
    }, [])

    useEffect(() => {
        const getDataByLangId = async (langId: string) => {
            await axiosInstance.get("appTexts", { params: { lang: langId, type: AppTextSetting[APP_TEXT_PROFILE] } })
                .then(({ data }) => {
                    setAppTexts(data);
                })
                .catch((e) => {
                    console.log(e);
                })
        }

        if (defaultLang != "") {
            getDataByLangId(defaultLang);
        }
    }, [defaultLang])

    return (
        <Layout>
            <div className="py-8 text-center">
                <span className="md:text-8xl text-4xl px-8 border-2 rounded-2xl border-blue-500 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-900">プロフィール</span>
            </div>
            <div className="text-right py-4 md:px-24 px-6">
                <select className="border-slate-500 rounded-xl border-2" onChange={(e) => setDefaultLang(e.target.value)}>
                    {languages.map((lang: Language) => {
                        return <option key={lang.id} value={lang.id}>{lang.name}</option>
                    })}
                </select>
            </div>
            <div className="justify-center items-center text-center py-8 md:flex md:px-24">
                <div className="md:w-1/5">
                    <Image className="rounded-full bg-white bg-opacity-50" src={imageUrl != "" ? process.env.NEXT_PUBLIC_API_URL + imageUrl : "/images/placeholder.png"} alt="logo" width={256} height={256} layout="intrinsic" />
                    <div className="flex justify-center gap-4 mt-2">
                        {urls.map(url => {
                            return <label key={url}>
                                <input className="hidden" type="radio" value={url} name="image_val" onClick={() => setImageURL(url)} />
                                <div className="bg-white hover:bg-teal-300 border-2 border-blue-500 rounded-lg w-6 h-6" />
                            </label>
                        })}
                    </div>
                </div>
                <div className="md:w-4/5 pt-8 mx-4">
                    <span className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-900">栗山こりー</span>
                    <div className="p-4 my-4 border-2 rounded-xl bg-white bg-opacity-50 border-blue-300 ring-2 ring-blue-500 text-left">
                        {appTexts.length !== 0 ? appTexts[0].text : null}
                    </div>
                </div>
            </div>
            <div className="py-12"></div>
        </Layout>
    )
}

export default Profile;