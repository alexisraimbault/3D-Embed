import { shapeSettingsType } from "./types"

const defaultSettingsByShape: {
    [shape: string]: shapeSettingsType
} = {
    planet: {
        colors: [
            '8c8c8c'
        ],
        metrics: [
            0.2,
            1.5,
            0.2,
            3.0,
            6.0,
            7.0,
        ],
    },
    morph: {
        colors: [
            'ff00ff',
            '0055ff',
        ],
        metrics: [],
    },
    network: {
        colors: [
            '00a822',
            '000000',
        ],
        metrics: [],
    },
    perlin: {
        colors: [
            'ff167f',
            '808080',
        ],
        metrics: [],
    }
}

const settingsParamsByShape: {
    [shape: string]: {
        type: string,
        index: number,
        label?: string,
        min?: number,
        max?: number,
        step?: number,
        defaultValue: string | number,
    }[]
} = {
    morph: [
        {
            type: 'color',
            index: 0,
            defaultValue: 'ff00ff'
        },
        {
            type: 'color',
            index: 1,
            defaultValue: '0055ff'
        },
    ],
    network: [
        {
            type: 'color',
            index: 0,
            label: 'Dots',
            defaultValue: 'ff00f7'
        },
        {
            type: 'color',
            index: 1,
            label: 'Links',
            defaultValue: '000000'
        },
    ],
    perlin: [
        {
            type: 'color',
            index: 0,
            label: 'Blob Color',
            defaultValue: 'ff167f'
        },
        {
            type: 'color',
            index: 1,
            label: 'Shadow Color',
            defaultValue: 'ffffff'
        },
    ],
    planet: [
        {
            type: 'color',
            index: 0,
            label: 'Palette base',
            defaultValue: '8c8c8c'
        },
        {
            type: 'metric',
            index: 0,
            defaultValue: 0.2,
            min: 0,
            max: 10,
            step: 0.1,
            label: 'Speed',
        },
        {
            type: 'metric',
            index: 1,
            defaultValue: 1.5,
            min: 0,
            max: 10,
            step: 0.5,
            label: 'Density',
        },
        {
            type: 'metric',
            index: 2,
            min: 0,
            max: 2,
            step: 0.1,
            defaultValue: 0.2,
            label: 'Strength',
        },
        {
            type: 'metric',
            index: 3,
            defaultValue: 3.0,
            min: 0,
            max: 40,
            step: 1,
            label: 'Frequency',
        },
        {
            type: 'metric',
            index: 4,
            defaultValue: 6.0,
            min: 0,
            max: 40,
            step: 1,
            label: 'Amplitude',
        },
        {
            type: 'metric',
            index: 5,
            defaultValue: 7.0,
            min: 0,
            max: 40,
            step: 1,
            label: 'Intensity',
        },
    ]
}

export {
    defaultSettingsByShape,
    settingsParamsByShape,
}