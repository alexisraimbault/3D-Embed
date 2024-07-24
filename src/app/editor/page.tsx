"use client"
import './styles.scss'

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@kobbleio/next/client'
import { ref, push, set, get } from "firebase/database";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'primereact/button';

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
import { cloneDeep } from '@utils/methods';
import { database } from '@utils/firebase';
import { BallPit } from '../../components/3dAssets/Ballpit';
import { XMasBallpit } from '../../components/3dAssets/XMasBallpit';
import { ImageParticles } from '../../components/3dAssets/ImageParticles';

type EditorPropsTypes = {};

const Editor = ({ }: EditorPropsTypes) => {
    // const { user } = useAuth();

    const defaultSettings = cloneDeep(defaultSettingsByShape)
    const [projectData, setProjectData] = useState<projectType>({
        // shape: null,
        // shapeSettings: {
        //     colors: [],
        //     metrics: [],
        //     images: []
        // },
        shape: 'imageParticles',
        shapeSettings: defaultSettingsByShape.imageParticles,
    })
    const [shouldReload, setShouldReload] = useState(false)

    // const [backgroundColor, setBackgroundColor] = useState('linear-gradient(45deg,   rgba(139,255,227,1) 0%, RGB(252, 138, 240) 100%)');
    const [backgroundColor, setBackgroundColor] = useState('rgb(0, 0, 0)');
    const [embedId, setEmbedId] = useState<string | null>(null)

    useEffect(() => {
        setShouldReload(true)
    }, [projectData, backgroundColor])

    const onSaveEmbed = () => {
        // if (!user) {
        //     return
        // }

        // const userId = user.id
        const isFirstSave = !embedId

        const embedData = {
            shapeSettings: projectData,
            backgroundColor,
        }

        if (isFirstSave) {
            const embedsListRef = ref(database, `embed/list`)
            const newEmbedRef = push(embedsListRef, embedData);
            const newEmbedId = newEmbedRef.key
            // const userEmbedsPointerRef = ref(database, `embed/users/${userId}/embeds/${newEmbedId}`)
            // set(userEmbedsPointerRef, {
            //     created_at: Date.now()
            // })
            setEmbedId(newEmbedId)
        } else {
            const embedRef = ref(database, `embed/list/${embedId}`)
            set(embedRef, embedData)
        }
    }

    useEffect(() => {
        onSaveEmbed()
    }, [
        projectData,
        backgroundColor,
        //  user,
        onSaveEmbed
    ])

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

        const shapeSettings = { ...defaultSettings[shape] }
        newProjectData.shapeSettings = { ...defaultSettings[shape] }
        newProjectData.shapeSettings = {
            colors: shapeSettings.colors,
            metrics: shapeSettings.metrics,
            images: [...projectData.shapeSettings.images],
        }
        setProjectData(newProjectData)
    }

    const onUpdateShape = (shape: string) => {
        const newProjectData = { ...projectData }
        newProjectData.shape = shape

        const shapesWithDefaultValues = Object.keys(defaultSettings)
        if (shapesWithDefaultValues.includes(shape)) {
            newProjectData.shapeSettings = { ...defaultSettings[shape] }
        }

        const isImageParticles = shape === 'imageParticles'

        if (isImageParticles) {
            setBackgroundColor('rgb(0, 0, 0)')
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
        ballpit: (
            <BallPit
                shapeSettings={projectData.shapeSettings}
            />
        ),
        xmasBallpit: (
            <XMasBallpit
                shapeSettings={projectData.shapeSettings}
            />
        ),
        imageParticles: (
            <ImageParticles
                shapeSettings={projectData.shapeSettings}
            />
        )
    }
    const availableShapes = Object.keys(shapeMap)

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/view/${embedId}`

    const embedCode = `
    <iframe 
        src="${shareUrl}" 
        title="Embed 3D render"
        width="500px"
        height="500px"
    >
    </iframe>
`

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
            >
                <div
                    className='editor__preview__links-wrapper'
                >
                    <CopyToClipboard
                        text={shareUrl}
                    >
                        <Button
                            label="Copy Link"
                            icon="pi pi-link"
                        />
                    </CopyToClipboard>
                    <CopyToClipboard
                        text={embedCode}
                    >
                        <Button
                            label="Copy Embed Code"
                            icon="pi pi-code"
                        />
                    </CopyToClipboard>
                </div>
                <div
                    className='editor__preview__inner'
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