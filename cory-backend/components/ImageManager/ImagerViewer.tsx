import { useContext, useEffect, useRef, useState } from "react";
import { ImageModel } from "../../models/image";
import { axiosInstance } from "../../utils/api";
import { ERROR_MSG_SERVER_CONNECT_FAIL, ERROR_MSG_UPDATE_FAIL, ERROR_MSG_UPDATE_SUCCESS } from "../../utils/commonErrorMessage";
import { ImageTag, IMAGE_TAG_HOME, IMAGE_TAG_PROFILE, IMAGE_TAG_RULE, IMAGE_TAG_JOINWAY, IMAGE_TAG_EXTERNALLINK, IMAGE_TAG_OTHER } from "../../utils/commonSetting";
import { NotificationContext } from "../Notification/Notification";
import ImageAdd from "./ImageAdd";
import ImageCard from "./ImageCard";
import Image from "next/image";

const ImagerViewer = () => {
    const { addMessage } = useContext(NotificationContext);
    const [images, setImages] = useState<ImageModel[]>([]);
    const [viewerTag, setTag] = useState(ImageTag[IMAGE_TAG_HOME]);
    const [showHint, setShowHint] = useState(false);

    const [id, setId] = useState(0);
    const inputName = useRef<HTMLInputElement>(null);
    const inputTag = useRef<HTMLSelectElement>(null);
    const [url, setUrl] = useState("himitukichi/images/placeholder.png");
    const [showEditor, setShowEditor] = useState(false);

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

    const addCallback = (image: ImageModel) => {
        if (image.tag == viewerTag) {
            let temp = [...images, image];
            setImages(temp);
        }
    }

    const handleUpdate = async () => {
        if (inputName.current && inputTag.current) {
            let updateName = inputName.current.value;
            let updateTag = parseInt(inputTag.current.value, 10);

            await axiosInstance.put("/admin/images/", {
                id: id,
                name: updateName,
                tag: updateTag,
                url: url,
            })
                .then(({ data }) => {
                    updateImageData(id, updateName, updateTag, url);
                    addMessage(ERROR_MSG_UPDATE_SUCCESS, true);
                }).catch((e) => {
                    addMessage(ERROR_MSG_UPDATE_FAIL, false);
                    console.log(e);
                });

            return;
        }
    }

    const openEditor = (imageData: ImageModel) => {
        if (inputName.current && inputTag.current) {
            inputName.current.value = imageData.name;
            inputTag.current.value = imageData.tag.toString();
            setUrl(imageData.image);
            setId(imageData.id);
        }
        setShowEditor(true);
    }

    const closeEditor = () => {
        setShowEditor(false);
        if (inputName.current && inputTag.current) {
            inputName.current.value = "";
            inputTag.current.value = "";
            setUrl("himitukichi/images/placeholder.png");
            setId(0);
        }
    }

    const updateImageData = (id: number, name: string, tag: number, url: string) => {
        if (tag !== viewerTag) {
            setImages(images.filter(v => v.id != id));
            return;
        }

        let find = false;
        let temp = [...images];
        temp.forEach(v => {
            if (v.id == id) {
                v.name = name;
                find = true;
            }
        })

        if (!find) {
            let imgData: ImageModel = {
                id: id,
                name: name,
                tag: tag,
                image: url
            }
            temp.push(imgData);
        }

        setImages(temp);
    }

    const deleteCallback = (id: number) => {
        setImages(images.filter(v => v.id != id));
    }

    return (
        <>
            <div className="w-full">
                <div className="flex gap-2 justify-center items-center">
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
                    <ImageAdd callback={addCallback} />
                </div>
                <div className="flex flex-wrap justify-center items-center gap-4 my-4">
                    {showHint && images.length == 0 ? <span className="italic text-4xl">{"このタグのイメージはまだありません"}</span> : null}
                    {images.map(imageData => { return <ImageCard key={imageData.id} imageData={imageData} updateCallback={openEditor} deleteCallback={deleteCallback} /> })}
                </div>
            </div>
            <div className={`z-40 bg-gray-600 bg-opacity-50 inset-0 px-4 absolute w-full h-full ${showEditor ? "" : "hidden"}`}>
                <div className="absolute h-full w-full left-0 top-0" onClick={() => setShowEditor(false)}></div>
                <div className="relative top-20 mx-auto shadow-lg rounded-md bg-white max-w-md">
                    <div className="flex justify-between items-center bg-emerald-500 text-white text-xl rounded-t-md px-4 py-2">
                        <h3>イメージを編集する</h3>
                        <button onClick={() => setShowEditor(false)}>X</button>
                    </div>
                    <div className="overflow-y-auto p-4">
                        <label className="block">
                            <span>イメージ名：</span>
                            <input type="text" ref={inputName} className="block w-full shadow-sm rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                        </label>
                        <label className="block mt-2 ">
                            <span>タグ：</span>
                            <select name="tag" ref={inputTag} className="block w-full shadow-sm rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <option value={ImageTag[IMAGE_TAG_HOME]}>ホーム</option>
                                <option value={ImageTag[IMAGE_TAG_PROFILE]}>プロフィール</option>
                                <option value={ImageTag[IMAGE_TAG_RULE]}>配信のお約束</option>
                                <option value={ImageTag[IMAGE_TAG_JOINWAY]}>参加型の説明</option>
                                <option value={ImageTag[IMAGE_TAG_EXTERNALLINK]}>外部リンク</option>
                                <option value={ImageTag[IMAGE_TAG_OTHER]}>その他</option>
                            </select>
                        </label>
                        <label className="block mt-2 ">
                            <span>ファイル：</span>
                            <div className="flex justify-center items-center h-64 relative text-center rounded-lg mt-2 bg-cyan-100">
                                <Image className="rounded-lg" src={process.env.NEXT_PUBLIC_API_URL + url} layout="fill" blurDataURL="himitukichi/images/placeholder.png" alt="loading" placeholder="empty" objectFit="contain" />
                            </div>
                        </label>
                    </div>
                    <div className="flex justify-end items-center px-4 py-2 border-t border-t-gray-500 gap-4">
                        <button className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white px-4 py-1 rounded transition" onClick={closeEditor}>いいえ</button>
                        <button className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white px-4 py-1 rounded transition" onClick={handleUpdate}>はい</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ImagerViewer;