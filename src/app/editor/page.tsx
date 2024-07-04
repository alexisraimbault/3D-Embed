"use client"
import './styles.scss'

import { ReactNode, useEffect, useState } from 'react';

import {
    EditorLeftSidebar,
    EditorRightSidebar,
    MorphBlob,
    Network,
    PerlinBlob,
    Planet
} from "@components";

import { projectType, shapeSettingsType } from '@utils/types';
import { defaultSettingsByShape } from '@utils/statics';

type EditorPropsTypes = {};

const Editor = ({ }: EditorPropsTypes) => {
    const defaultSettings = JSON.parse(JSON.stringify(defaultSettingsByShape))
    console.log({ morphSettings: defaultSettings.morph })
    const [projectData, setProjectData] = useState<projectType>({
        shape: null,
        shapeSettings: {
            colors: [],
            metrics: []
        },
        background: {
            type: 'none',
            color1: null,
            color2: null,
        },
    })
    const [shouldReload, setShouldReload] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState('linear-gradient(45deg,   rgba(139,255,227,1) 0%, RGB(252, 138, 240) 100%)');

    useEffect(() => {
        setShouldReload(true)
    }, [projectData, backgroundColor])

    useEffect(() => {
        if (shouldReload) {
            setShouldReload(false)
        }
    }, [shouldReload])

    const onResetDefaultSettings = () => {
        const shape = projectData.shape || ''
        const newProjectData = { ...projectData }

        const shapesWithDefaultValues = Object.keys(defaultSettings)
        if (!shapesWithDefaultValues.includes(shape)) {
            return
        }

        console.log({ settings: defaultSettings[shape] })
        newProjectData.shapeSettings = { ...defaultSettings[shape] }
        setProjectData(newProjectData)
    }

    const onUpdateShape = (shape: string) => {
        const newProjectData = { ...projectData }
        newProjectData.shape = shape

        const shapesWithDefaultValues = Object.keys(defaultSettings)
        if (shapesWithDefaultValues.includes(shape)) {
            newProjectData.shapeSettings = { ...defaultSettings[shape] }
        }

        setProjectData(newProjectData)
    }

    const onUpdateShapeSettings = (newSettings: shapeSettingsType) => {
        const newProjectData = { ...projectData }
        newProjectData.shapeSettings = newSettings
        setProjectData(newProjectData)
    }

    const shapeMap: {
        [i: string]: ReactNode,
    } = {
        morph: (
            <MorphBlob
                shapeSettings={projectData.shapeSettings}
            />
        ),
        network: (
            <Network
                shapeSettings={projectData.shapeSettings}
            />
        ),
        perlin: (
            <PerlinBlob
                shapeSettings={projectData.shapeSettings}
            />
        ),
        planet: (
            <Planet
                shapeSettings={projectData.shapeSettings}
            />
        ),
    }
    const availableShapes = Object.keys(shapeMap)

    return (
        <div className="editor__wrapper">
            <EditorLeftSidebar
                onUpdateShape={onUpdateShape}
                seletedShape={projectData.shape}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
            />
            <div
                className='editor__preview__wrapper'
                style={{
                    background: backgroundColor,
                }}
            >
                {projectData.shape && availableShapes.includes(projectData.shape) && !shouldReload && (
                    <>
                        {shapeMap[projectData.shape]}
                    </>
                )}
            </div>
            <EditorRightSidebar
                onUpdateShapeSettings={onUpdateShapeSettings}
                onResetDefaultSettings={onResetDefaultSettings}
                projectData={projectData}
            />
        </div>
    );
}

export default Editor