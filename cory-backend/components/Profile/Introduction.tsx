import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { AppText } from "../../models/apptext";
import { Language } from "../../models/language";
import { axiosInstance } from "../../utils/api";
import { ERROR_MSG_UPDATE_FAIL, ERROR_MSG_UPDATE_SUCCESS } from "../../utils/commonErrorMessage";
import { AppTextSetting, APP_TEXT_PROFILE } from "../../utils/commonSetting";
import { NotificationContext } from "../Notification/Notification";

const Introduction = () => {
    const { addMessage } = useContext(NotificationContext);
    const [textArea, setTextArea] = useState("");
    const [languages, setLanguages] = useState<Language[]>([]);
    const [appTexts, setAppTexts] = useState<AppText[]>([]);
    const [currentLangId, setCurrentLangId] = useState("");
    const [btnControl, setBtnControl] = useState(false);

    const upsertSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (appTexts.length == 0) {
            await createSubmit();
            return;
        }

        await updateSubmit();
    }

    const createSubmit = async () => {
        await axiosInstance.post("/admin/appTexts", {
            language_id: parseInt(currentLangId, 10),
            type: AppTextSetting[APP_TEXT_PROFILE],
            order: 0,
            image: "",
            text: textArea,
        }).then(({ data }) => {
            let temp = [...appTexts, data]
            setAppTexts(temp);
            addMessage(ERROR_MSG_UPDATE_SUCCESS, true);
        }).catch((e) => {
            console.log(e);
            addMessage(ERROR_MSG_UPDATE_FAIL, true);
        });
    }

    const updateSubmit = async () => {
        await axiosInstance.put("/admin/appTexts", {
            id: appTexts[0].id,
            language_id: appTexts[0].language_id,
            type: appTexts[0].type,
            order: appTexts[0].order,
            image: appTexts[0].image,
            text: textArea,
        }).then(({ data }) => {
            let temp = [...appTexts, data]
            setAppTexts(temp);
            addMessage(ERROR_MSG_UPDATE_SUCCESS, true);
        }).catch((e) => {
            console.log(e);
            addMessage(ERROR_MSG_UPDATE_FAIL, true);
        });
    }

    const setLanguageList = (langs: Language[]) => {
        setLanguages(langs);
        setCurrentLangId((langs[0]?.id).toString());
    }

    const setForm = (texts: AppText[]) => {
        setAppTexts(texts);
        if (texts.length != 0) {
            setTextArea(texts[0]?.text);
        } else {
            setTextArea("");
        }
    }

    useEffect(() => {
        const getLanguages = async () => {
            await axiosInstance.get('languages')
                .then(({ data }) => {
                    setLanguageList(data);
                })
                .catch((e) => {
                    console.log(e);
                })
        }
        getLanguages();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            setBtnControl(false);
            await axiosInstance.get("appTexts", { params: { lang: currentLangId, type: AppTextSetting[APP_TEXT_PROFILE] } })
                .then(({ data }) => {
                    setBtnControl(true);
                    setForm(data);
                })
                .catch((e) => {
                    console.log(e);
                })
        }

        if (currentLangId !== "") {
            fetchData();
        }
    }, [currentLangId])

    return (
        <div className="flex flex-col w-full items-center">
            <select className="w-fit border-slate-500 rounded-xl border" onChange={(e) => setCurrentLangId(e.target.value)}>
                {languages.map((lang) => {
                    return <option key={lang.id} value={lang.id}>{lang.nick_name}</option>
                })}
            </select>
            <div className="my-4 p-4 md:w-2/3 w-full mx-auto rounded-xl bg-gradient-to-tr from-sky-100 to-teal-200 border-2 border-emerald-500">
                <div className="mb-6">
                    <h2 className="block text-center mb-1 md:mb-0 text-xl font-bold">自己紹介</h2>
                </div>
                <div className="mb-6">
                    <textarea className="h-64 appearance-none border border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 resize-none" placeholder="自己紹介を書いてください" disabled={!btnControl} value={textArea} onChange={(e) => setTextArea(e.target.value)} />
                </div>
                <div className="text-center">
                    <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onClick={upsertSubmit} disabled={!btnControl}>
                        {appTexts.length == 0 ? "新着" : "アップデート"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Introduction;