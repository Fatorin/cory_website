import Image from "next/image";
import { NotificationContext } from "../Notification/Notification";
import { useContext, useState } from "react";
import { axiosInstance } from "../../utils/api";
import { ERROR_MSG_DELETE_FAIL, ERROR_MSG_DELETE_SUCCESS, ERROR_MSG_SERVER_CONNECT_FAIL, ERROR_MSG_UPDATE_FAIL, ERROR_MSG_UPDATE_SUCCESS } from "../../utils/commonErrorMessage";
import { ImageModel } from "../../models/image";

type ImageType = {
    imageData: ImageModel;
    updateCallback: (imageData: ImageModel) => void;
    deleteCallback: (id: number) => void;
}

export const ImageCard = ({ imageData, updateCallback, deleteCallback }: ImageType) => {
    const { addMessage } = useContext(NotificationContext);
    const [showScale, setShowScale] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const handleDelete = async () => {
        await axiosInstance.delete(`/admin/images/${imageData.id}`)
            .then(() => {
                setShowDelete(false);
                addMessage(ERROR_MSG_DELETE_SUCCESS, true);
                deleteCallback(imageData.id);
            }).catch((e) => {
                addMessage(ERROR_MSG_DELETE_FAIL, false);
            });
    }

    const handleUpdate = (imageData: ImageModel) => {
        updateCallback(imageData);
    }

    return (
        <>
            <div className="justify-center items-center text-center relative bg-white border-2 border-gray-200 rounded-lg p-4 max-w-lg w-96">
                <span className="break-all">{imageData.name}</span>
                <div className="h-64 bg-gray-200 relative my-4 rounded-lg" onClick={() => setShowScale(true)}>
                    <Image className="rounded-lg" src={process.env.NEXT_PUBLIC_API_URL + imageData.image} alt={imageData.name} layout="fill" blurDataURL="himitukichi/images/placeholder.png" placeholder="empty" objectFit="contain" />
                </div>
                <div className="flex justify-center items-center gap-2">
                    <button className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white px-4 py-1 rounded transition" onClick={() => setShowDelete(true)}>削除する</button>
                    <button className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white px-4 py-1 rounded transition" onClick={() => handleUpdate(imageData)}>編集する</button>
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
                    <Image onClick={() => setShowScale(false)} className="rounded-lg" src={process.env.NEXT_PUBLIC_API_URL + imageData.image} alt={imageData.name} layout="fill" blurDataURL="himitukichi/images/placeholder.png" placeholder="empty" objectFit="contain" quality={100} />
                </div>
            </div>
        </>
    )
}


export default ImageCard;