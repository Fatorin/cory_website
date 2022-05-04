import { useContext, useEffect, useRef, useState } from "react";
import { NotificationContext } from "../../components/Notification/Notification";
import { AppText } from "../../models/apptext";
import { Language } from "../../models/language";
import { axiosInstance } from "../../utils/api";
import { ERROR_MSG_UPDATE_FAIL, ERROR_MSG_UPDATE_SUCCESS } from "../../utils/commonErrorMessage";
import Image from "next/image";
import ImageSelector from "../ImageManager/ImageSelector";

type EditorType = {
    title: string;
    editorType: number;
    turnOnImageSelector?: boolean;
}

const NewStepEditor = ({ title, editorType, turnOnImageSelector }: EditorType) => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [appTexts, setAppTexts] = useState<AppText[]>([]);
    const [currentLangId, setCurrentLangId] = useState("");
    const [sourceAppTexts, setSourceAppTexts] = useState<AppText[]>([]);
    const [hasError, setHasError] = useState(false);
    const { addMessage } = useContext(NotificationContext);

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

    const setAppTextImageByOrder = (order: number, urls: string[]) => {
        let temp = [...appTexts]
        temp.forEach((appText) => {
            if (appText.order == order) {
                appText.image = urls[0];
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
            temp.language_id = parseInt(currentLangId, 10);
            temp.type = editorType;
            temp.order = appTexts.length + 1;
            temp.text = "";
            temp.image = "";
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
        setHasError(false);
        if (appTexts.length == 0 && sourceAppTexts.length == 0) {
            addMessage("ステップを追加してください", false);
            setHasError(true);
            return;
        }

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

        if (hasError) {
            addMessage(ERROR_MSG_UPDATE_FAIL, false);
        } else {
            addMessage(ERROR_MSG_UPDATE_SUCCESS, true);
        }
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
            })
            .catch((e) => {
                console.log(e);
                setHasError(true);
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
            })
            .catch((e) => {
                console.log(e);
                setHasError(true);
            })
    }

    const deleteAppTextApi = async (appText: AppText | undefined) => {
        if (appText == undefined) {
            return;
        }
        await axiosInstance.delete(`/admin/appTexts/${appText.id}`)
            .catch((e) => {
                console.log(e);
                setHasError(true);
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
            await axiosInstance.get("appTexts", { params: { lang: currentLangId, type: editorType } })
                .then(({ data }) => {
                    setAppTextsList(data);
                })
                .catch((e) => {
                    console.log(e);
                })
        }

        if (currentLangId !== "") {
            fetchData();
        }
    }, [currentLangId, editorType])

    return (
        <>
            <h1 className="text-6xl py-8 text-center">{title}</h1>
            <div className="flex flex-wrap text-center gap-2 justify-center">
                <select className="border-slate-500 rounded-xl border shadow" onChange={(e) => setCurrentLangId(e.target.value)}>
                    {languages.map((lang) => {
                        return <option key={lang.id} value={lang.id}>{lang.nick_name}</option>
                    })}
                </select>
                <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white px-4 py-2 rounded" type="button" onClick={() => addStep()}>
                    追加
                </button>
                <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white px-4 py-2 rounded" type="button" onClick={() => removeStep()}>
                    最後のを削除します
                </button>
                <button className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white px-4 py-2 rounded" type="button" onClick={() => updateAppText()}>
                    アップデート
                </button>
            </div>
            {appTexts.length == 0 ? <div className="text-center my-8 text-4xl italic">この言語のはまだ作りません</div> : <div>
                {appTexts.map((appText) => {
                    return <div key={appText.order} className="mx-auto md:w-2/3 w-full align-middle my-2 p-4 rounded-xl bg-gradient-to-tr from-sky-100 to-teal-200 border-2 border-emerald-500 animate-fadeIn">
                        <h2 className="block text-center text-xl font-bold pb-3">{title} {appText.order}</h2>
                        <div className="flex gap-2">
                            {turnOnImageSelector ? <div className="flex flex-col bg-gray-200 rounded-lg justify-center items-center">
                                <ImageSelector callback={(urls) => {
                                    setAppTextImageByOrder(appText.order, urls);
                                }}
                                    limit={1} >
                                    <Image className="rounded-lg" src={appText.image != "" ? process.env.NEXT_PUBLIC_API_URL + appText.image : "/himitukichi/images/placeholder.png"} height={128} width={128} layout="intrinsic" alt="loading" placeholder="empty" objectFit="contain" />
                                </ImageSelector>
                            </div> : null}
                            <textarea className="appearance-none border border-gray-200 rounded w-full leading-tight focus:outline-none focus:bg-white focus:border-gray-500 resize-none" value={appText.text} onChange={(e) => setAppTextsByOrder(appText.order, e.target.value)} />
                        </div>
                    </div>
                })}
            </div>}
        </>
    )
}

export default NewStepEditor;