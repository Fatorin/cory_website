import React, { SyntheticEvent, useContext, useEffect, useImperativeHandle, useState } from "react";
import Image from "next/image";
import { ImageSelectorModel } from "../../models/image";
import { axiosInstance } from "../../utils/api";
import { ERROR_MSG_SERVER_CONNECT_FAIL } from "../../utils/commonErrorMessage";
import { ImageTag, IMAGE_TAG_EXTERNALLINK, IMAGE_TAG_HOME, IMAGE_TAG_JOINWAY, IMAGE_TAG_OTHER, IMAGE_TAG_PROFILE, IMAGE_TAG_RULE } from "../../utils/commonSetting";
import { NotificationContext } from "../Notification/Notification";

type ImageSelectorType = {
    callback: (urls: string[]) => void;
    limit: number;
    children?: React.ReactNode;
}

export const ImageSelector = ({ children, callback, limit }: ImageSelectorType) => {
    const { addMessage } = useContext(NotificationContext);
    const [images, setImages] = useState<ImageSelectorModel[]>([]);
    const [viewerTag, setTag] = useState(ImageTag[IMAGE_TAG_HOME]);
    const [showHint, setShowHint] = useState(false);
    const [selectIDs, setSelectIDs] = useState<number[]>([]);
    const [showSelector, setShowSelector] = useState(false);

    useEffect(() => {
        setShowHint(false);
        const fetchData = async () => {
            await axiosInstance.get("/images", { params: { tag: viewerTag } })
                .then(({ data }) => {
                    setImages(data);
                })
                .catch((e) => {
                    console.log(e);
                    addMessage(ERROR_MSG_SERVER_CONNECT_FAIL, false);
                });
        }

        fetchData();
        setShowHint(true);
    }, [viewerTag, addMessage])

    const setTagHandle = (tag: string) => {
        const parsed = parseInt(tag, 10);
        if (isNaN(parsed)) {
            return;
        }
        setTag(parsed);
    }

    const setSelectID = (id: number) => {
        let temp = [...images];
        images.forEach(image => {
            if (image.id == id) {
                if (image.isSelected == true) {
                    setSelectIDs(selectIDs.filter(v => v != id));
                } else {
                    if (selectIDs.length >= limit) {
                        return;
                    }
                    setSelectIDs([...selectIDs, id]);
                }
                image.isSelected = !image.isSelected;
            }
        });
        setImages(temp);
    }

    const sendCallback = () => {
        let urls: string[] = [];
        selectIDs.forEach(id => {
            const imageData = images.find(v => v.id == id);
            if (imageData != undefined) {
                urls.push(imageData.image);
            }
        })

        if (urls.length !== 0) {
            callback(urls);
            closeModal();
        }
    }

    const clearSelectIDs = () => {
        let temp = [...images];
        images.forEach(image => {
            image.isSelected = false;
        });
        setImages(temp);
        setSelectIDs([]);
    }

    const closeModal = () => {
        setShowSelector(false);
        clearSelectIDs();
    }

    return (
        <>
            {children ? <div onClick={() => setShowSelector(true)}>{children}</div> : <button className="w-fit bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition" onClick={() => setShowSelector(true)}>イメージを選択する</button>}
            <div className={`z-40 bg-gray-600 bg-opacity-50 inset-0 p-4 absolute w-full h-full ${showSelector ? "" : "hidden"}`}>
                <div className="absolute h-full w-full left-0 top-0" onClick={closeModal}></div>
                <div className="w-full mx-auto bg-white rounded-lg relative">
                    <div className="flex justify-between items-center bg-emerald-500 text-white text-xl rounded-t-md px-4 py-2">
                        <h3>イメージ選択ツール</h3>
                        <button onClick={() => setShowSelector(false)}>X</button>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center items-center p-4">
                        <label>
                            <select name="tag" className="shadow-sm rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" onChange={(e) => setTagHandle(e.currentTarget.value)}>
                                <option value={ImageTag[IMAGE_TAG_HOME]} defaultValue={ImageTag[IMAGE_TAG_HOME]}>ホーム</option>
                                <option value={ImageTag[IMAGE_TAG_PROFILE]}>プロフィール</option>
                                <option value={ImageTag[IMAGE_TAG_RULE]}>配信のお約束</option>
                                <option value={ImageTag[IMAGE_TAG_JOINWAY]}>参加型の説明</option>
                                <option value={ImageTag[IMAGE_TAG_EXTERNALLINK]}>外部リンク</option>
                                <option value={ImageTag[IMAGE_TAG_OTHER]}>その他</option>
                            </select>
                        </label>
                        <label>
                            <button className="shadow bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-500 focus:shadow-outline focus:outline-none text-white px-4 py-2 rounded transition" onClick={sendCallback}>選択する</button>
                        </label>
                        {selectIDs.length != 0 ?
                            <label>
                                <button className="shadow bg-orange-400 hover:bg-orange-300 active:bg-orange-400 focus:shadow-outline focus:outline-none text-white px-4 py-2 rounded transition" onClick={clearSelectIDs}>すべてキャンセル</button>
                            </label> : null
                        }
                    </div>
                    <div className="gap-4 p-4 flex flex-wrap justify-center items-center">
                        {showHint && images.length == 0 ? <span className="italic text-4xl">{"このタグのイメージはまだありません"}</span> : null}
                        {images.map(imageData => {
                            return <div key={imageData.id} className={`justify-center items-center text-center relative bg-white border-2 border-gray-200 rounded-lg p-4 max-w-lg w-96 transition-colors delay-75 ease-in-out ${imageData.isSelected ? "border-orange-400" : null}`} onClick={() => setSelectID(imageData.id)}>
                                <span className="break-all">{imageData.name}</span>
                                <div className="h-64 bg-gray-200 relative my-4 rounded-lg">
                                    <Image className="rounded-lg" src={process.env.NEXT_PUBLIC_API_URL + imageData.image} alt={imageData.name} layout="fill" blurDataURL="himitukichi/images/placeholder.png" placeholder="empty" objectFit="contain" />
                                </div>
                            </div>
                        })}
                    </div>
                </div >
            </div>
        </>
    )
}

export default ImageSelector;