export class ImageModel {
    id!: number;
    name!: string;
    tag!: number;
    image!: string;
}

export class ImageSelectorModel {
    id!: number;
    name!: string;
    tag!: number;
    image!: string;
    isSelected: boolean = false;
}