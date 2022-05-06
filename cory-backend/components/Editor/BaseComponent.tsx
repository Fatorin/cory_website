import { useContext, useEffect, useRef, useState } from "react";
import { ComponentModel } from "../../models/component";
import { axiosInstance } from "../../utils/api";
import ImageSelector from "../ImageManager/ImageSelector";
import Image from "next/image";
import { NotificationContext } from "../Notification/Notification";
import { ERROR_MSG_UPDATE_FAIL, ERROR_MSG_UPDATE_SUCCESS } from "../../utils/commonErrorMessage";

type BaseComponentType = {
    type: number;
    name: string;
    height: number;
    width: number;
    limit: number;
    urlOption?: boolean;
}

const BaseComponent = ({ type, name, height, width, limit, urlOption }: BaseComponentType) => {
    const { addMessage } = useContext(NotificationContext);
    const [component, setComponent] = useState<ComponentModel>();
    const [urls, setUrls] = useState<string[]>([]);
    const inputText = useRef<HTMLInputElement>(null);
    const [texts, setTexts] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNewUrls = (urls: string[]) => {
        handleUrls(urls);
        if (inputText.current !== null) {
            inputText.current.value = "";
        }
        var strs: string[] = [];
        for (let index = 0; index < urls.length; index++) {
            strs.push("");
        }
        setTexts(strs);
        setCurrentIndex(0);
    }

    const handleUrls = (urls: string[]) => {
        setUrls(urls);
    }

    const handleTexts = (texts: string[]) => {
        if (inputText.current !== null) {
            inputText.current.value = texts[0];
        }
        setTexts(texts);
    }

    const convertTextsToString = (texts: string[]) => {
        let str = "";
        for (let index = 0; index < texts.length; index++) {
            if (index < texts.length - 1) {
                str += texts[index] + ",";
            } else {
                str += texts[index];
            }
        }
        return str;
    }

    const updateLink = () => {
        if (inputText.current !== null) {
            let temp = [...texts];
            temp[currentIndex] = inputText.current.value;
            setTexts(temp);
        }
    }

    const addComponent = async () => {
        await axiosInstance.post("/admin/components", {
            type: type,
            image: convertTextsToString(urls),
            text: convertTextsToString(texts),
            custom_setting: "",
        })
            .then(({ data }) => {
                setComponent(data);
                addMessage(ERROR_MSG_UPDATE_SUCCESS, true);
            })
            .catch((e) => {
                console.log(e);
                addMessage(ERROR_MSG_UPDATE_FAIL, false);
            })
    }

    const updateComponent = async () => {
        await axiosInstance.put("/admin/components", {
            id: component?.id,
            type: type,
            image: convertTextsToString(urls),
            text: convertTextsToString(texts),
            custom_setting: component?.custom_setting,
        })
            .then(({ data }) => {
                setComponent(data);
                addMessage(ERROR_MSG_UPDATE_SUCCESS, true);
            })
            .catch((e) => {
                console.log(e);
                addMessage(ERROR_MSG_UPDATE_FAIL, false);
            })
    }

    const handleUpsert = async () => {
        if (component) {
            if (convertTextsToString(urls) == "") {
                addMessage("まだ設定しません。", false);
                return;
            }

            if (convertTextsToString(urls) == component.image && convertTextsToString(texts) == component.text) {
                addMessage("同じファイルでした。", false);
                return;
            }

            if (component.id == 0) {
                await addComponent();
            } else {
                await updateComponent();
            }
        }
    }

    const prev = () => {
        if (currentIndex > 0) {
            if (inputText.current) {
                inputText.current.value = texts[currentIndex - 1];
            }
            setCurrentIndex(currentIndex - 1);
        }
    }

    const next = () => {
        if (currentIndex < urls.length - 1) {
            if (inputText.current) {
                inputText.current.value = texts[currentIndex + 1];
            }
            setCurrentIndex(currentIndex + 1);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await axiosInstance.get("components", { params: { type: type } })
                .then(({ data }) => {
                    setData(data);
                })
                .catch((e) => {
                    console.log(e);
                })
        }

        const setData = (data: ComponentModel) => {
            handleUrls(data.image.split(','));
            handleTexts(data.text.split(','));
            setCurrentIndex(0);
            setComponent(data);
        }

        fetchData();
    }, [type])

    return (
        <div className="flex flex-col p-4 justify-center items-center gap-4">
            <div className="flex w-fit border border-gray-600 rounded-lg bg-gray-200">
                <Image className="rounded-lg" src={urls.length !== 0 ? process.env.NEXT_PUBLIC_API_URL + urls[currentIndex] : "/himitukichi/images/placeholder.png"} height={height} width={width} layout="intrinsic" alt="loading" placeholder="empty" objectFit="contain" />
            </div>
            {urlOption ? <label className="text-center border border-gray-600 bg-gray-200">
                <input className="w-96" type="text" placeholder="URL設定" ref={inputText} onChange={updateLink} />
            </label> : null}
            {urls.length > 1 ? <div className="flex justify-between items-center gap-4">
                <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={prev}>{"< 前へ"}</button>
                <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={next}>{"次へ >"}</button>
            </div> : null}
            <p className="text-center">{urls.length == 0 ? `まだ${name}のイメージを設定しません。推奨サイズは${height}x${width}。最大値${limit}つ。` : `推奨サイズは${height}x${width}。最大値${limit}つ`}</p>
            <div className="flex justify-center items-center gap-4">
                <ImageSelector callback={handleNewUrls} limit={limit} />
                <button className="shadow bg-green-500 hover:bg-green-400 active:bg-cyan-500 focus:shadow-outline focus:outline-none text-white px-4 py-2 rounded transition" onClick={handleUpsert}>セーブ</button>
            </div>
            {convertTextsToString(urls) != component?.image && convertTextsToString(texts) != component?.text ? <p className="text-center">イメージはまだセーブしません。</p> : null}
        </div>
    )
}

export default BaseComponent;