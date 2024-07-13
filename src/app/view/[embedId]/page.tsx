"use client"
import './styles.scss'

import { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'next/navigation'
import { ref, get } from "firebase/database";

import {
    MorphBlob,
    Network,
    PerlinBlob,
    Planet
} from "@components";

import { projectType } from '@utils/types';
import { database } from '@utils/firebase';
import { BallPit } from '../../../components/3dAssets/Ballpit';
import { XMasBallpit } from '../../../components/3dAssets/XMasBallpit';
import { ImageParticles } from '../../../components/3dAssets/ImageParticles';

type ViewPropsTypes = {};

const ViewPage = ({ }: ViewPropsTypes) => {
    const params = useParams()
    const { embedId } = params

    const [projectData, setProjectData] = useState<projectType>({
        shape: null,
        shapeSettings: {
            colors: [],
            metrics: [],
            images: []
        },
    })
    const [backgroundColor, setBackgroundColor] = useState('linear-gradient(45deg,   rgba(139,255,227,1) 0%, RGB(252, 138, 240) 100%)');

    useEffect(() => {
        fetchInitialData()
    }, [embedId])

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

    const fetchInitialData = async () => {
        if (!embedId) {
            return
        }

        const embedsRef = ref(database, `embed/list/${embedId}`)
        const snapshot = await get(embedsRef)
        const snapshotData = snapshot.val()
        const bgColor = snapshotData?.backgroundColor
        const shape = snapshotData?.shapeSettings?.shape
        const shapeSettings = snapshotData?.shapeSettings?.shapeSettings

        if (bgColor) {
            setBackgroundColor(bgColor)
        }

        if (shape && availableShapes.includes(shape) && shapeSettings) {
            const newProjectData = {
                shape,
                shapeSettings,
            }
            setProjectData(newProjectData)
        }
    }

    return (
        <div
            className="view-page__wrapper"
            style={{
                background: backgroundColor,
            }}
        >
            {projectData.shape && availableShapes.includes(projectData.shape) && (
                <>
                    {shapeMap[projectData.shape]}
                </>
            )}
        </div>
    );
}

export default ViewPage