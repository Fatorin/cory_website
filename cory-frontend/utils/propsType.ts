import { EmoteDatas, InfoData } from "../models/infoData"

export type ImageURLType = {
    image: string
    text?: string
}

export type ADType = {
    images: string[]
    texts: string[]
}

export type StampType = {
    emotes: EmoteDatas[]
    badges: InfoData[]
}

export type LinkBarType = {
    image: string
    emotes: EmoteDatas[]
    badges: InfoData[]
}