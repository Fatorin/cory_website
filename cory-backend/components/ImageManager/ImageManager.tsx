import { useEffect, useState } from "react"
import { ImageModel } from "../../models/image"

export const ImageManager = () => {
    const [images, setImages] = useState<ImageModel[]>([]);

    useEffect(() => {
        const fetchData = () => { }
        fetchData();
    })

    const removeImage = (id: number) => {
        setImages(images.filter(v => v.id != id));
    }

    return (
        <>
        </>
    )
}