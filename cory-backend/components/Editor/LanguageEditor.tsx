import { useCallback, useEffect, useState } from "react"
import { Language } from "../../models/language";
import { axiosInstance } from "../../utils/api";

const defaultThead = [
    { key: 0, name: "言語名" },
    { key: 1, name: "ローカル名" },
    { key: 2, name: "言語コード" },
    { key: 3, name: "利用可能" },
]

const initLangs = [
    { region: "none", name: "言語選択", nickname: "言語選択" },
    { region: "ja-jp", name: "日本語", nickname: "日本語" },
    { region: "zh-tw", name: "繁體中文", nickname: "中国語（繁体字）" },
    { region: "zh-cn", name: "简体中文", nickname: "中国語（簡体字）" },
    { region: "en-us", name: "English", nickname: "英語" },
    { region: "ko-kr", name: "한국어", nickname: "韓国語" },
    { region: "fr-fr", name: "Français", nickname: "フランス語" },
    { region: "es-es", name: "Español(EUW)", nickname: "スペイン語(EUW)" }
]

export const LanguageEditor = () => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [defaultLangs, setDefaultLangs] = useState(initLangs);
    const [currentLang, setCurrentLang] = useState("none");
    const [addBtn, setAddBtn] = useState(false);

    const toggleButton = (language: Language) => {

        if (language.region == "ja-jp") {
            return ("既定")
        }

        if (language.available) {
            return (<button className="border-2 rounded-xl text-white border-green-900 bg-green-700 hover:bg-green-600 active:bg-green-500 px-2" onClick={e => toggleLanguage(language)}>オン</button>)
        }

        return (<button className="border-2 rounded-xl text-white border-red-900 bg-red-600 hover:bg-red-900 px-2" onClick={e => toggleLanguage(language)}>オフ</button>)
    }

    const addLanguage = async () => {
        setAddBtn(true);
        if (currentLang == "none") {
            console.log("正しい言語を選択してください");
            setAddBtn(false);
            return;
        }

        const langData = initLangs.find((value) => value.region == currentLang);

        if (langData == undefined || langData == null) {
            console.log("も一度を選択してください");
            return;
        }

        await axiosInstance.post("/admin/languages", {
            region: langData?.region,
            name: langData?.name,
            nick_name: langData?.nickname,
            available: false,
        })
            .then(() => {
                fetchData();
            }).catch((error) => {
                console.log(error);
            });

        setAddBtn(false);
    }

    const toggleLanguage = async (lang: Language) => {
        await axiosInstance.put('/admin/languages', {
            id: lang.id,
            region: lang.region,
            name: lang.name,
            nick_name: lang.nick_name,
            available: !lang.available,
        })
            .then(({ data }) => {
                console.log("toggle success.");
                console.log(data);
                let list = [...languages];
                list.forEach(element => {
                    if (element.id == lang.id) {
                        element.available = data.available;
                    }
                });
                setLanguages(list);
            })
            .catch(() => {
                console.log("update fail");
            })
    }

    const fetchData = useCallback(() => {
        const getLanguages = async () => {
            await axiosInstance.get('languages')
                .then(({ data }) => {
                    setLanguages(data);
                    filterLang(data);
                })
                .catch((e) => {
                    console.log("Error");
                })
        }

        const filterLang = (langs: Language[]) => {
            let filterList = [...initLangs];
            langs.forEach(lang => {
                filterList = filterList.filter((oldLang) => oldLang.region.toLowerCase() !== lang.region.toLowerCase());
            });
            setDefaultLangs(filterList);
        }

        getLanguages();
    }, [])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    return (
        <>
            <div className="w-fit rounded-xl overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-100 border border-emerald-500">
                <table className="table-auto text-center align-middle">
                    <caption className="py-2 text-xl font-bold">言語設定</caption>
                    <thead>
                        <tr>
                            {defaultThead.map(thead => {
                                return <td className="border-emerald-500 px-4 py-2" key={thead.key}>{thead.name}</td>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {languages.map(language => {
                            return <tr key={language.id}>
                                <td className="border-emerald-500 px-4 py-2 font-medium">{language.name}</td>
                                <td className="border-emerald-500 px-4 py-2 font-medium">{language.nick_name}</td>
                                <td className="border-emerald-500 px-4 py-2 font-medium">{language.region}</td>
                                <td className="border-emerald-500 px-4 py-2 font-medium">{toggleButton(language)}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <div className="py-2 pr-2 float-right">
                    <select className="border-slate-500 rounded-xl border-2" onChange={(e) => setCurrentLang(e.target.value)}>
                        {defaultLangs.map((lang) => {
                            return <option key={lang.region} value={lang.region}>{lang.nickname}</option>
                        })}
                    </select>
                    <button className="border-slate-500 rounded-xl border-2 bg-yellow-400 px-2 ml-4 hover:bg-yellow-200 active:bg-yellow-100" disabled={addBtn} onClick={() => addLanguage()}>追加する</button>
                </div>
            </div>
        </>
    )
}