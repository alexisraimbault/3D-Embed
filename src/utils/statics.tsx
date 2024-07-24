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
        images: [],
    },
    morph: {
        colors: [
            'ff00ff',
            '0055ff',
        ],
        metrics: [],
        images: [],
    },
    network: {
        colors: [
            '00a822',
            'ffffff',
        ],
        metrics: [],
        images: [],
    },
    perlin: {
        colors: [
            'ff167f',
        ],
        metrics: [],
        images: [],
    },
    ballpit: {
        colors: [
            '4400ff',
            'ff0000',
        ],
        metrics: [],
        images: [],
    },
    xmasBallpit: {
        colors: [
            'c0a0a0',
            'ff0000',
            '8a492f'
        ],
        metrics: [],
        images: [],
    },
    imageParticles: {
        colors: [
            'ffffff',
            'ffffff',
        ],
        metrics: [
            5.0,
            5.0,
            0.0,
            0.0,
            0.0,
            5.0,
        ],
        images: ['cly4dq15i00uhyiopjiztmgq7_1721820981855'],
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
            defaultValue: 'ffffff'
        },
    ],
    perlin: [
        {
            type: 'color',
            index: 0,
            label: 'Blob Color',
            defaultValue: 'ff167f'
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
    ],
    ballpit: [
        {
            type: 'color',
            index: 0,
            label: 'Balls',
            defaultValue: '4400ff'
        },
        {
            type: 'color',
            index: 1,
            label: 'Light',
            defaultValue: 'ff0000'
        },
    ],
    xmasBallpit: [
        {
            type: 'color',
            index: 0,
            label: 'Bubbles',
            defaultValue: 'c0a0a0'
        },
        {
            type: 'color',
            index: 1,
            label: 'Light',
            defaultValue: 'ff0000'
        },
        {
            type: 'color',
            index: 2,
            label: 'Cap',
            defaultValue: '8a492f'
        },
    ],
    imageParticles: [
        {
            type: 'image',
            index: 0,
            label: 'Image',
            defaultValue: ''
        },
        {
            type: 'color',
            index: 0,
            label: 'From',
            defaultValue: 'ffffff'
        },
        {
            type: 'color',
            index: 1,
            label: 'To',
            defaultValue: 'ffffff'
        },
        {
            type: 'metric',
            index: 0,
            label: 'Cursor Size',
            defaultValue: 5.0,
            min: 1,
            max: 10,
            step: 0.1,
        },
        {
            type: 'metric',
            index: 1,
            label: 'Particle Size',
            defaultValue: 5.0,
            min: 1,
            max: 20,
            step: 0.1,
        },
        {
            type: 'metric',
            index: 2,
            label: 'Grayscale Boost',
            defaultValue: 0.0,
            min: -1,
            max: 1,
            step: 0.001,
        },
        {
            type: 'metric',
            index: 3,
            label: 'Grayscale Inverter',
            defaultValue: 0.0,
            min: 0,
            max: 1,
            step: 1,
        },
        {
            type: 'metric',
            index: 4,
            label: 'Visibility Threshold',
            defaultValue: 0.0,
            min: 0,
            max: 1,
            step: 0.001,
        },
        {
            type: 'metric',
            index: 5,
            label: 'Displacement Intensity',
            defaultValue: 5.0,
            min: 0,
            max: 40,
            step: 1,
        },
    ]
}

export {
    defaultSettingsByShape,
    settingsParamsByShape,
}