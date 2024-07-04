export type shapeSettingsType = {
    colors: string[],
    metrics: number[],
}

export type projectType = {
    shape: null | string,
    shapeSettings: shapeSettingsType,
    background: {
        type: string,
        color1: string | null,
        color2: string | null,
    }
}