import { useContext, useEffect, useState } from "react";
import { ImageModel } from "../../models/image";
import { axiosInstance } from "../../utils/api";
import { ERROR_MSG_SERVER_CONNECT_FAIL } from "../../utils/commonErrorMessage";
import { ImageTag, IMAGE_TAG_HOME, IMAGE_TAG_PROFILE, IMAGE_TAG_RULE, IMAGE_TAG_JOINWAY, IMAGE_TAG_EXTERNALLINK, IMAGE_TAG_OTHER } from "../../utils/commonSetting";
import { NotificationContext } from "../Notification/Notification";
import ImageAdd from "./ImageAdd";
import ImageCard from "./ImageCard";

const ImagerViewer = () => {
    const [images, setImages] = useState<ImageModel[]>([]);
    const [tag, setTag] = useState(ImageTag[IMAGE_TAG_HOME]);
    const { addMessage } = useContext(NotificationContext);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await axiosInstance.get("/images", { params: { tag: tag } })
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
    }, [tag, addMessage])

    const setTagHandle = (tag: string) => {
        const parsed = parseInt(tag, 10);
        if (isNaN(parsed)) {
            return;
        }
        setTag(parsed);
    }

    const addCallback = (image: ImageModel) => {
        if (image.tag == tag) {
            let temp = [...images, image];
            setImages(temp);
        }
    }

    const updateCallback = (id: number, callbackName: string, callbackTag: number) => {
        if (callbackTag !== tag) {
            setImages(images.filter(v => v.id != id));
            return;
        }

        let temp = [...images];
        temp.forEach(v => {
            if (v.id == id) {
                v.name = callbackName;
            }
        })
        setImages(temp);
    }

    const deleteCallback = (id: number) => {
        setImages(images.filter(v => v.id != id));
    }

    return (
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
            <div className="gap-4 pt-8 flex flex-wrap justify-center items-center">
                {showHint && images.length == 0 ? <span className="italic text-4xl">{"このタグのイメージはまだありません"}</span> : null}
                {images.map(v => { return <ImageCard key={v.id} id={v.id} name={v.name} tag={v.tag} url={v.image} updateCallback={updateCallback} deleteCallback={deleteCallback} /> })}
            </div>
        </div>
    )
}

export default ImagerViewer;