import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { AppText } from "../models/apptext";
import { Language } from "../models/language";
import { axiosInstance } from "../utils/api";
import { AppTextSetting, APP_TEXT_JOINWAY } from "../utils/appTextSetting";

const JoinWay: NextPage = () => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [appTexts, setAppTexts] = useState<AppText[]>([]);

    const getRuleByLangId = async (langId: string) => {
        await axiosInstance.get("appTexts", { params: { lang: langId, type: AppTextSetting[APP_TEXT_JOINWAY] } })
            .then(({ data }) => {
                setAppTexts(data);
            })
            .catch((e) => {
                console.log(e);
                console.log("Error");
            })
    }

    useEffect(() => {
        const getLanguages = async () => {
            await axiosInstance.get('languages')
                .then(({ data }) => {
                    setLanguageList(data);
                })
                .catch((e) => {
                    console.log("Error");
                })
        }

        const setLanguageList = (langs: Language[]) => {
            setLanguages(langs);
            if (langs.length > 0) {
                getRuleByLangId(langs[0].id.toString());
            }
        }
        
        getLanguages();
    }, [])

    return (
        <Layout>
            <div className="w-full">
                <div className="pt-16 pb-4 text-center">
                    <span className="md:text-8xl text-4xl px-8 border-2 rounded-2xl border-blue-500 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-900">参加型の説明</span>
                </div>
                <div className="text-right py-4 md:px-24 px-6">
                    <select className="border-slate-500 rounded-xl border-2" onChange={(e) => getRuleByLangId(e.target.value)}>
                        {languages.map((lang: Language) => {
                            return <option key={lang.id} value={lang.id}>{lang.name}</option>
                        })}
                    </select>
                </div>
                <div className="justify-center items-center text-center py-32 px-4 md:px-24">
                    {appTexts.length == 0 ? <span className="text-8xl text-cyan-600">工事中( ´•̥̥̥ω•̥̥̥` )・・・</span> : null}
                    {appTexts.map(v => {
                        return <div key={v.id} className="mt-2 p-4 bg-white bg-opacity-50 ring-1 ring-blue-800 border-2 rounded-lg border-blue-400 text-left">{v.text}</div>
                    })}
                </div>
            </div>
            <div className="py-12" />
        </Layout>
    )
}

export default JoinWay;