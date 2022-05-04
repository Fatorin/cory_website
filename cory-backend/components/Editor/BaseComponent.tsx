import { useContext, useEffect, useState } from "react";
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
}

const BaseComponent = ({ type, name, height, width, limit }: BaseComponentType) => {
    const { addMessage } = useContext(NotificationContext);
    const [logo, setLogo] = useState<ComponentModel>();
    const [url, setUrl] = useState("");
    const [urls, setUrls] = useState<string[]>([]);

    const handleUrls = (urls: string[]) => {
        setUrl(urls[0]);
        setUrls(urls);
    }

    const convertUrlsToString = (urls: string[]) => {
        let str = "";
        for (let index = 0; index < urls.length; index++) {
            if (index < urls.length - 1) {
                str += urls[index] + ",";
            } else {
                str += urls[index];
            }
        }
        return str;
    }

    const addComponent = async () => {
        await axiosInstance.post("/admin/components", {
            type: type,
            image: convertUrlsToString(urls),
            text: "",
            custom_setting: "",
        })
            .then(({ data }) => {
                setLogo(data);
                addMessage(ERROR_MSG_UPDATE_SUCCESS, true);
            })
            .catch((e) => {
                console.log(e);
                addMessage(ERROR_MSG_UPDATE_FAIL, false);
            })
    }

    const updateComponent = async () => {
        await axiosInstance.put("/admin/components", {
            id: logo?.id,
            type: type,
            image: convertUrlsToString(urls),
            text: logo?.text,
            custom_setting: logo?.custom_setting,
        })
            .then(({ data }) => {
                setLogo(data);
                addMessage(ERROR_MSG_UPDATE_SUCCESS, true);
            })
            .catch((e) => {
                console.log(e);
                addMessage(ERROR_MSG_UPDATE_FAIL, false);
            })
    }

    const handleUpsert = async () => {
        if (logo) {
            if (convertUrlsToString(urls) == "") {
                addMessage("まだ設定しません。", false);
                return;
            }

            if (convertUrlsToString(urls) == logo.image) {
                addMessage("同じファイルでした。", false);
                return;
            }

            if (logo.id == 0) {
                await addComponent();
            } else {
                await updateComponent();
            }
        }
    }

    const prev = () => {
        for (let index = 0; index < urls.length; index++) {
            if (url == urls[index]) {
                if (index > 0) {
                    setUrl(urls[index - 1]);
                }
            }
        }
    }

    const next = () => {
        for (let index = 0; index < urls.length; index++) {
            if (url == urls[index]) {
                if (index < urls.length - 1) {
                    setUrl(urls[index + 1]);
                }
            }
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
            setLogo(data);
        }

        fetchData();
    }, [type])

    return (
        <div className="flex flex-col p-4 justify-center items-center">
            <div className="flex w-fit border border-gray-600 rounded-lg bg-gray-200">
                <Image className="rounded-lg" src={url != "" ? process.env.NEXT_PUBLIC_API_URL + url : "/himitukichi/images/placeholder.png"} height={height} width={width} layout="intrinsic" alt="loading" placeholder="empty" objectFit="contain" />
            </div>
            {urls.length > 1 ? <div className="flex justify-between items-center mt-4 gap-4">
                <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={prev}>{"< 前へ"}</button>
                <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={next}>{"次へ >"}</button>
            </div> : null}
            <p className="text-center mt-4">{url == "" ? `まだ${name}のイメージを設定しません。推奨サイズは${height}x${width}。最大値${limit}つ。` : `推奨サイズは${height}x${width}。最大値${limit}つ`}</p>
            <div className="flex justify-center items-center gap-4 mt-4">
                <ImageSelector callback={handleUrls} limit={limit} />
                <button className="shadow bg-green-500 hover:bg-green-400 active:bg-cyan-500 focus:shadow-outline focus:outline-none text-white px-4 py-2 rounded transition" onClick={handleUpsert}>セーブ</button>
            </div>
            {convertUrlsToString(urls) != logo?.image ? <p className="text-center mt-4">イメージはまだセーブしません。</p> : null}
        </div>
    )
}

export default BaseComponent;