export type shapeSettingsType = {
    colors: string[],
    metrics: number[],
    images: string[],
}

export type projectType = {
    shape: null | string,
    shapeSettings: shapeSettingsType,
}