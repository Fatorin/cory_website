import { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { AppText } from "../models/apptext";
import { Language } from "../models/language";
import { axiosInstance } from "../utils/api";
import { AppTextSetting, APP_TEXT_RULE } from "../utils/appTextSetting";

const Rule: NextPage = () => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [appTexts, setAppTexts] = useState<AppText[]>([]);
    const [currentLangId, setCurrentLangId] = useState("");
    const [sourceAppTexts, setSourceAppTexts] = useState<AppText[]>([]);

    const setAppTextsList = (appTexts: AppText[]) => {
        setAppTexts(appTexts);
        setSourceAppTexts(appTexts);
    }

    const setAppTextsByOrder = (order: number, text: string) => {
        let temp = [...appTexts]
        temp.forEach((appText) => {
            if (appText.order == order) {
                appText.text = text;
            }
        })
        setAppTexts(temp);
    }

    const addStep = () => {
        let temp = sourceAppTexts.find(v => v.order == appTexts.length + 1);

        if (temp != undefined) {
            temp.text = "";
        } else {
            temp = new AppText();
            temp.language_id = parseInt(currentLangId);
            temp.type = AppTextSetting[APP_TEXT_RULE];
            temp.order = appTexts.length + 1;
            temp.text = "";
        }

        const tempList = [...appTexts, temp]
        setAppTexts(tempList);
    }

    const removeStep = () => {
        if (appTexts.length == 0) {
            return;
        }
        let tempList = [...appTexts]
        tempList.pop();
        setAppTexts(tempList);
    }

    const updateAppText = async () => {
        if (appTexts.length < sourceAppTexts.length) {
            for (let index = 0; index < sourceAppTexts.length - appTexts.length; index++) {
                let temp = [...sourceAppTexts];
                deleteAppTextApi(temp.pop());
                setSourceAppTexts(temp);
            }
        }

        appTexts.forEach(async (v) => {
            if (v.id != 0 && v.id != undefined) {
                await updateAppTextApi(v);
            } else {
                await insertAppTextApi(v);
            }
        })
    }

    const insertAppTextApi = async (appText: AppText) => {
        await axiosInstance.post('/admin/appTexts', {
            language_id: appText.language_id,
            type: appText.type,
            order: appText.order,
            image: appText.image,
            text: appText.text,
        })
            .then(({ data }) => {
                upsertAppText(data);
                console.log("insert success");
            })
            .catch(() => {
                console.log("insert fail");
            })
    }

    const updateAppTextApi = async (appText: AppText) => {
        await axiosInstance.put('/admin/appTexts', {
            id: appText.id,
            language_id: appText.language_id,
            type: appText.type,
            order: appText.order,
            image: appText.image,
            text: appText.text,
        })
            .then(({ data }) => {
                upsertAppText(data);
                console.log("update success");
            })
            .catch(() => {
                console.log("update fail");
            })
    }

    const deleteAppTextApi = async (appText: AppText | undefined) => {
        if (appText == undefined) {
            return;
        }
        await axiosInstance.delete(`/admin/appTexts/${appText.id}`)
            .then(() => {
                console.log("delete success");
            })
            .catch(() => {
                console.log("delete fail");
            })
    }

    const upsertAppText = (appText: AppText) => {
        let temp = [...appTexts];
        temp.forEach(value => {
            if (appText.order == value.order) {
                value = appText;
            }
        });
        setAppTextsList(temp);
    }

    useEffect(() => {
        const getLanguages = async () => {
            await axiosInstance.get('languages')
                .then(({ data }) => {
                    setLanguageList(data);
                })
                .catch((e) => {
                    console.log(e);
                    console.log("Error");
                })
        }

        const setLanguageList = (langs: Language[]) => {
            setLanguages(langs);
            if (langs.length > 0) {
                setCurrentLangId((langs[0]?.id).toString());
            }
        }
        
        getLanguages();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await axiosInstance.get("appTexts", { params: { lang: currentLangId, type: AppTextSetting[APP_TEXT_RULE] } })
                .then(({ data }) => {
                    setAppTextsList(data);
                })
                .catch((e) => {
                    console.log(e);
                    console.log("Error");
                })
        }
        if (currentLangId !== "") {
            fetchData();
        }
    }, [currentLangId])

    return (
        <Layout>
            <div className="p-4 w-full rounded-xl overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-100 border border-emerald-500">
                <select className="border-slate-500 rounded-xl border-2" onChange={(e) => setCurrentLangId(e.target.value)}>
                    {languages.map((lang) => {
                        return <option key={lang.id} value={lang.id}>{lang.nick_name}</option>
                    })}
                </select>
                <button className="ml-2 shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white py-1 px-4 rounded" type="button" onClick={() => addStep()}>
                    ステップを追加
                </button>
                <button className="ml-2 shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white py-1 px-4 rounded" type="button" onClick={() => removeStep()}>
                    最後のステップを削除します
                </button>
                <button className="ml-2 shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white py-1 px-4 rounded" type="button" onClick={() => updateAppText()}>
                    アップデート
                </button>
            </div>
            {appTexts.length == 0 ? null : <form className="w-full">
                {appTexts.map((appText) => {
                    return <div key={appText.order} className="w-full align-middle my-2 p-4 rounded-xl overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-100 border border-emerald-500">
                        <h2 className="block text-center text-xl font-bold pb-3">ステップ {appText.order}</h2>
                        <textarea className="h-16 appearance-none border-2 border-gray-200 rounded w-full leading-tight focus:outline-none focus:bg-white focus:border-gray-500 resize-none" value={appText.text} onChange={(e) => setAppTextsByOrder(appText.order, e.target.value)} />
                    </div>
                })}
            </form>}
        </Layout>
    )
}

export default Rule;