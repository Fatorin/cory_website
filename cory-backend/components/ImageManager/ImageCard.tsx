import Image from "next/image";
import { NotificationContext } from "../Notification/Notification";
import { useContext, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../utils/api";
import { ImageTag, IMAGE_TAG_EXTERNALLINK, IMAGE_TAG_HOME, IMAGE_TAG_JOINWAY, IMAGE_TAG_OTHER, IMAGE_TAG_PROFILE, IMAGE_TAG_RULE } from "../../utils/commonSetting";
import { ERROR_MSG_DELETE_FAIL, ERROR_MSG_DELETE_SUCCESS, ERROR_MSG_SERVER_CONNECT_FAIL, ERROR_MSG_UPDATE_FAIL, ERROR_MSG_UPDATE_SUCCESS } from "../../utils/commonErrorMessage";

type ImageType = {
    id: number;
    name: string;
    tag: number;
    url: string;
    updateCallback: (id: number, name: string, tag: number) => void;
    deleteCallback: (id: number) => void;
}

export const ImageCard = ({ id, name, tag, url, updateCallback, deleteCallback }: ImageType) => {
    const { addMessage } = useContext(NotificationContext);
    const [showScale, setShowScale] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const inputName = useRef<HTMLInputElement>(null);
    const inputTag = useRef<HTMLSelectElement>(null);

    const handleUpdate = async () => {
        if (inputName.current && inputTag.current) {
            let updateName = inputName.current.value;
            let updateTag = parseInt(inputTag.current.value, 10);
            
            if (updateName == name && updateTag == tag) {
                addMessage("データを変更していません。", false);
                return;
            }

            await axiosInstance.put("/admin/images/", {
                id: id,
                name: updateName,
                tag: updateTag,
                url: url,
            })
                .then(({ data }) => {
                    updateCallback(id, updateName, updateTag);
                    addMessage(ERROR_MSG_UPDATE_SUCCESS, true);
                }).catch((e) => {
                    addMessage(ERROR_MSG_UPDATE_FAIL, false);
                });

            return;
        }
    }

    const handleDelete = async () => {
        await axiosInstance.delete(`/admin/images/${id}`)
            .then(() => {
                setShowDelete(false);
                addMessage(ERROR_MSG_DELETE_SUCCESS, true);
                deleteCallback(id);
            }).catch((e) => {
                addMessage(ERROR_MSG_DELETE_FAIL, false);
            });
    }

    const closeEditor = () => {
        if (inputName.current) {
            inputName.current.value = name;
        }
        if (inputTag.current) {
            inputTag.current.value = tag.toString();
        }
        setShowEditor(false);
    }

    useEffect(() => {
        if (inputName.current) {
            inputName.current.value = name;
        }
        if (inputTag.current) {
            inputTag.current.value = tag.toString();
        }
    }, [name, tag]);

    return (
        <>
            <div className="justify-center items-center text-center relative bg-white border-2 border-gray-200 rounded-lg p-4 max-w-lg w-96">
                <span className="break-all">{name}</span>
                <div className="h-64 bg-gray-200 relative my-4 rounded-lg" onClick={() => setShowScale(true)}>
                    <Image className="rounded-lg" src={process.env.NEXT_PUBLIC_API_URL + url} alt={name} layout="fill" blurDataURL="/himitukichi/images/placeholder.png" placeholder="empty" objectFit="contain" />
                </div>
                <div className="flex justify-center items-center gap-2">
                    <button className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white px-4 py-1 rounded transition" onClick={() => setShowDelete(true)}>削除する</button>
                    <button className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white px-4 py-1 rounded transition" onClick={() => setShowEditor(true)}>編集する</button>
                </div>
                <div className={`z-40 bg-gray-600 bg-opacity-50 rounded-lg inset-0 absolute px-4 w-full h-full ${showDelete ? "" : "hidden"}`}>
                    <div className="absolute h-full w-full" onClick={() => setShowDelete(false)}></div>
                    <div className="relative top-1/3 mx-auto shadow-lg rounded-md bg-white max-w-md">
                        <div className="flex justify-between items-center bg-red-500 text-white text-xl rounded-t-md px-4 py-2">
                            <h3>削除を確認する</h3>
                            <button onClick={() => setShowDelete(false)}>X</button>
                        </div>
                        <div className="px-4 py-2 border-t border-t-gray-500 flex justify-end items-center space-x-4">
                            <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white px-4 py-1 rounded transition" onClick={() => setShowDelete(false)}>いいえ</button>
                            <button className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white px-4 py-1 rounded transition" onClick={() => handleDelete()}>はい</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`z-40 bg-gray-600 inset-0 absolute w-full h-full ${showScale ? null : "hidden"}`}>
                <div className="absolute h-full w-full left-0 top-0" onClick={() => setShowScale(false)}></div>
                <div className="relative h-full bg-gray-500">
                    <Image onClick={() => setShowScale(false)} className="rounded-lg" src={process.env.NEXT_PUBLIC_API_URL + url} alt={name} layout="fill" blurDataURL="/himitukichi/images/placeholder.png" placeholder="empty" objectFit="contain" quality={100} />
                </div>
            </div>
            <div className={`z-40 bg-gray-600 bg-opacity-50 inset-0 px-4 absolute w-full h-full ${showEditor ? "" : "hidden"}`}>
                <div className="absolute h-full w-full left-0 top-0" onClick={closeEditor}></div>
                <div className="relative top-20 mx-auto shadow-lg rounded-md bg-white max-w-md">
                    <div className="flex justify-between items-center bg-emerald-500 text-white text-xl rounded-t-md px-4 py-2">
                        <h3>イメージを編集する</h3>
                        <button onClick={closeEditor}>X</button>
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
                                <Image className="rounded-lg" src={process.env.NEXT_PUBLIC_API_URL + url} layout="fill" blurDataURL="/himitukichi/images/placeholder.png" alt="loading" placeholder="empty" objectFit="contain" />
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


export default ImageCard;