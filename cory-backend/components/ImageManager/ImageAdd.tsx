import { ChangeEvent, SyntheticEvent, useState, DragEvent, useContext, useRef } from "react";
import Image from "next/image";
import { ImageTag, IMAGE_TAG_EXTERNALLINK, IMAGE_TAG_HOME, IMAGE_TAG_JOINWAY, IMAGE_TAG_OTHER, IMAGE_TAG_PROFILE, IMAGE_TAG_RULE } from "../../utils/commonSetting";
import { NotificationContext } from "../Notification/Notification";
import { ImageModel } from "../../models/image";
import { axiosInstance } from "../../utils/api";

type ImageCallBackType = {
    callback: (image: ImageModel) => void;
}

const ImageAdd = ({ callback }: ImageCallBackType) => {
    const { addMessage } = useContext(NotificationContext);
    const [show, setShow] = useState(false);
    const [url, setURL] = useState("/himitukichi/images/placeholder.png");
    const inputName = useRef<HTMLInputElement>(null);
    const [tag, setTag] = useState(ImageTag[IMAGE_TAG_HOME]);
    const [file, setFile] = useState<File>();
    const [loading, setLoading] = useState(true);
    const [hint, setHint] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadDone, setUploadDone] = useState(false);

    const upload = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (uploading) {
            return;
        }

        setUploading(true);

        if (file == undefined || !inputName.current) {
            return;
        }

        if (inputName.current.value == "") {
            return;
        }

        var bodyFormData = new FormData();
        bodyFormData.append("name", inputName.current.value);
        bodyFormData.append("tag", tag.toString());
        bodyFormData.append("file", file);

        await axiosInstance.post("/admin/images", bodyFormData)
            .then(({ data }) => {
                callback(data);
                addMessage("アップロード成功しました", true);
            })
            .catch(e => {
                console.log(e);
            })

        setUploadDone(true);
        setUploading(false);
    }

    const openModal = () => {
        setShow(true);
    }

    const closeModal = () => {
        setLoading(true);
        if (inputName.current) {
            inputName.current.value = "";
        }
        setURL("/himitukichi/images/placeholder.png");
        setFile(undefined);
        setShow(false);
        setUploadDone(false);
        setUploading(false);
    }

    const convertTagToInt = (tag: string) => {
        const parsed = parseInt(tag, 10);
        if (!isNaN(parsed)) {
            setTag(parsed);
        }
    }

    const imageHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            fileHandle(e.target.files);
        }
    }

    const onDragEnter = (e: SyntheticEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setHint(true);
    }

    const onDragLeave = () => {
        setHint(false);
    }

    const onDragOver = (e: SyntheticEvent) => {
        e.stopPropagation();
        e.preventDefault();
    }

    const onDrag = (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setHint(false);
        if (e.dataTransfer.files[0].type !== "image/png" && e.dataTransfer.files[0].type !== "image/jpeg") {
            return;
        }
        fileHandle(e.dataTransfer.files);
    }

    const fileHandle = (e: FileList) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState == 2) {
                setLoading(false);
                setURL(reader.result as string);
            }
        }
        reader.readAsDataURL(e[0]);
        setFile(e[0]);
    }

    return (
        <>
            <button className="w-fit bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition" onClick={openModal}>イメージを追加する</button>
            <div className={`z-40 bg-gray-600 bg-opacity-50 inset-0 px-4 absolute w-full h-full ${show ? "" : "hidden"}`}>
                <div className="absolute h-full w-full left-0 top-0" onClick={closeModal}></div>
                <div className="relative top-20 mx-auto shadow-lg rounded-md bg-white max-w-md">
                    <div className="flex justify-between items-center shadow bg-green-500 focus:shadow-outline focus:outline-none text-white px-4 py-2 rounded transition">
                        <h3>イメージを追加する</h3>
                        <button onClick={closeModal}>X</button>
                    </div>
                    <div className="overflow-y-auto p-4">
                        <label className="block">
                            <span>イメージ名：</span>
                            <input type="text" ref={inputName} className="block w-full shadow-sm rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                        </label>
                        <label className="block mt-2 ">
                            <span>タグ：</span>
                            <select name="tag" onChange={(e) => convertTagToInt(e.target.value)} className="block w-full shadow-sm rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <option value={ImageTag[IMAGE_TAG_HOME]} defaultValue={ImageTag[IMAGE_TAG_HOME]}>ホーム</option>
                                <option value={ImageTag[IMAGE_TAG_PROFILE]}>プロフィール</option>
                                <option value={ImageTag[IMAGE_TAG_RULE]}>配信のお約束</option>
                                <option value={ImageTag[IMAGE_TAG_JOINWAY]}>参加型の説明</option>
                                <option value={ImageTag[IMAGE_TAG_EXTERNALLINK]}>外部リンク</option>
                                <option value={ImageTag[IMAGE_TAG_OTHER]}>その他</option>
                            </select>
                        </label>
                        <label className="block mt-2 ">
                            <span> ファイル：</span>
                            <div className={`flex justify-center items-center h-64 relative text-center rounded-lg mt-2 active:bg-cyan-300 ${hint ? `bg-cyan-300` : `bg-cyan-100`}`} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={(e) => onDrag(e)}>
                                <div className={loading ? "absolute text-sm" : "hidden"}>ドラッグまたはクリックして画像をアップロードします</div>
                                <input className="opacity-0 w-full h-full" type="file" accept="image/png, image/jpeg" onChange={e => imageHandler(e)} ></input>
                                {loading ? null : <Image className="rounded-lg" src={url} layout="fill" blurDataURL="/himitukichi/images/placeholder.png" alt="loading" placeholder="empty" objectFit="contain" />}
                            </div>
                        </label>
                    </div>
                    <div className="px-4 py-2 border-t border-t-gray-500 flex justify-end items-center space-x-4">
                        {!uploadDone ? <><button className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white px-4 py-2 rounded transition" onClick={closeModal}>いいえ</button>
                            <button className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white px-4 py-2 rounded transition" onClick={upload}>はい</button></> :
                            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition" onClick={closeModal}>完了</button>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ImageAdd;