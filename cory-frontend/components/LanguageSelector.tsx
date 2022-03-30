import { useState } from "react";
import { Language } from "../models/language";
import { axiosInstance } from "../utils/api";

const LanguageSelector = () => {
    const [languages, setLanguages] = useState<Language[]>([]);

    const getLanguages = async () => {
        await axiosInstance.get('languages')
            .then(({ data }) => {
                setLanguages(data);
            })
            .catch((e) => {
                console.log("Error");
            })
    }
}

export default LanguageSelector;