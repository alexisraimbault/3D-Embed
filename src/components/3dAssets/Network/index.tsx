import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdditiveBlending, Vector3 } from 'three'
import { OrbitControls } from '@react-three/drei'

import { shapeSettingsType } from '@utils/types'
import { defaultSettingsByShape } from '@utils/statics';

interface NetworkPropsTypes {
    interaction?: string,
    shapeSettings?: shapeSettingsType,
    isSidebar?: boolean,
};

export const Network = ({
    interaction = 'timer',
    shapeSettings = { ...defaultSettingsByShape.network },
    isSidebar = false
}: NetworkPropsTypes) => {

    return (
        <Canvas
            camera={{ position: [0, 0, 17.5] }}
        >
            <NeuralNetworkCanvaContent
                interaction={interaction}
                shapeSettings={shapeSettings}
            />
            {!isSidebar && <OrbitControls />}
        </Canvas>
    );
}

const NeuralNetworkCanvaContent = ({
    interaction,
    shapeSettings
}: {
    interaction: string,
    shapeSettings: shapeSettingsType
}) => {
    const groupRef = useRef<any>()
    const particlesRef = useRef<any>()
    const linesGeometryRef = useRef<any>()

    const maxParticleCount = 1000
    const particleCount = 500
    const r = 10
    const rHalf = r / 2
    const maxConnections = 20
    const minDistance = 2.5
    let vertexpos = 0
    let colorpos = 0
    let numConnected = 0

    const segments = maxParticleCount * maxParticleCount
    const positions = useMemo(() => new Float32Array(segments * 3), [segments])
    const colors = useMemo(() => new Float32Array(segments * 3), [segments])

    const particlePositions = useMemo(() => new Float32Array(maxParticleCount * 3), [])

    const particlesData = useMemo<{
        numConnections: number,
        velocity: Vector3,
    }[]>(() => [], [])

    const v = useMemo(() => new Vector3(), [])

    useEffect(() => {
        for (let i = 0; i < maxParticleCount; i++) {
            const x = Math.random() * r - r / 2
            const y = Math.random() * r - r / 2
            const z = Math.random() * r - r / 2

            particlePositions[i * 3] = x
            particlePositions[i * 3 + 1] = y
            particlePositions[i * 3 + 2] = z

            const v = new Vector3(
                -1 + Math.random() * 2,
                -1 + Math.random() * 2,
                -1 + Math.random() * 2
            )
            particlesData.push({
                velocity: v.normalize().divideScalar(50),
                numConnections: 0
            })
        }

        particlesRef.current.setDrawRange(0, particleCount)
    })

    useFrame((_, delta) => {
        vertexpos = 0
        colorpos = 0
        numConnected = 0

        for (let i = 0; i < particleCount; i++) {
            if (particlesData && particlesData[i]) {
                particlesData[i].numConnections = 0
            }
        }

        for (let i = 0; i < particleCount; i++) {
            const particleData = particlesData[i]

            v.set(
                particlePositions[i * 3],
                particlePositions[i * 3 + 1],
                particlePositions[i * 3 + 2]
            )
            if (particleData && particleData.velocity) {
                v.add(particleData.velocity)
            }
            v.setLength(10)
            particlePositions[i * 3] = v.x
            particlePositions[i * 3 + 1] = v.y
            particlePositions[i * 3 + 2] = v.z

            if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf)
                if (particleData && particleData.velocity && particleData.velocity.y) {
                    particleData.velocity.y = -particleData.velocity.y
                }

            if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf)
                if (particleData && particleData.velocity && particleData.velocity.x) {
                    particleData.velocity.x = -particleData.velocity.x
                }

            if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf)
                if (particleData && particleData.velocity && particleData.velocity.z) {
                    particleData.velocity.z = -particleData.velocity.z
                }

            if (particleData && particleData.numConnections >= maxConnections) continue

            for (let j = i + 1; j < particleCount; j++) {
                const particleDataB = particlesData[j]
                if (particleDataB && particleDataB.numConnections >= maxConnections) continue

                const dx = particlePositions[i * 3] - particlePositions[j * 3]
                const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1]
                const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2]
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

                if (dist < minDistance) {
                    if (particleData && particleData.numConnections) {
                        particleData.numConnections++
                    }
                    if (particleDataB && particleDataB.numConnections) {
                        particleDataB.numConnections++
                    }

                    const alpha = 1.0 - dist / minDistance

                    positions[vertexpos++] = particlePositions[i * 3]
                    positions[vertexpos++] = particlePositions[i * 3 + 1]
                    positions[vertexpos++] = particlePositions[i * 3 + 2]

                    positions[vertexpos++] = particlePositions[j * 3]
                    positions[vertexpos++] = particlePositions[j * 3 + 1]
                    positions[vertexpos++] = particlePositions[j * 3 + 2]

                    colors[colorpos++] = alpha
                    colors[colorpos++] = alpha
                    colors[colorpos++] = alpha

                    colors[colorpos++] = alpha
                    colors[colorpos++] = alpha
                    colors[colorpos++] = alpha

                    numConnected++
                }
            }
        }

        linesGeometryRef.current.setDrawRange(0, numConnected * 2)
        linesGeometryRef.current.attributes.position.needsUpdate = true
        linesGeometryRef.current.attributes.color.needsUpdate = true

        particlesRef.current.attributes.position.needsUpdate = true

        if (groupRef && groupRef.current) {
            if (interaction === 'scroll') {
                const { scrollY } = window;
                groupRef.current.rotation.y = scrollY / 500
            }
            if (interaction === 'timer') {
                groupRef.current.rotation.y += delta / 5
            }
        }
    })

    return (

        <group
            ref={groupRef}
            dispose={null}
        >
            <points>
                <bufferGeometry ref={particlesRef}>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={particlePositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color={`#${shapeSettings.colors[0]}`}
                    size={3}
                    blending={AdditiveBlending}
                    transparent={true}
                    sizeAttenuation={false}
                />
            </points>
            <lineSegments>
                <bufferGeometry ref={linesGeometryRef}>
                    <bufferAttribute
                        attach="attributes-position"
                        count={positions.length / 3}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={colors.length / 3}
                        array={colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    // color={'#87F2E7'}
                    color={`#${shapeSettings.colors[1]}`}
                    vertexColors={true}
                    blending={AdditiveBlending}
                    transparent={true}
                />
            </lineSegments>
        </group>
    )
}