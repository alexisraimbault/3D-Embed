import { MutableRefObject, RefObject, useRef } from 'react'
import {
    MeshLambertMaterial,
    MeshStandardMaterial,
    SphereGeometry,
    Vector3,
    MathUtils,
    Color,
    Object3D,
    Mesh
} from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, useGLTF } from "@react-three/drei"
import { EffectComposer, SSAO } from "@react-three/postprocessing"
import { BallCollider, Physics, RigidBody, CylinderCollider, RigidBodyProps, RapierRigidBody } from "@react-three/rapier"

import { shapeSettingsType } from "@utils/types";
import { defaultSettingsByShape } from '@utils/statics';

interface XMasBallpitPropsTypes {
    shapeSettings?: shapeSettingsType,
    isSidebar?: boolean,
};

export const XMasBallpit = ({
    shapeSettings = { ...defaultSettingsByShape.xmasBallpit },
    isSidebar = false
}: XMasBallpitPropsTypes) => {

    const baubles = [...Array(50)].map(() => ({ scale: [0.75, 0.75, 1, 1, 1.25][Math.floor(Math.random() * 5)] }))

    return (
        <Canvas
            shadows
            gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
            camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
            onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}>
            <ambientLight intensity={1} />
            {/* <spotLight
                position={[20, 20, 25]}
                penumbra={1}
                angle={0.2}
                color="white"
                castShadow
                shadow-mapSize={[512, 512]}
            /> */}
            <directionalLight
                position={[0, 5, -4]}
                intensity={4}
            />
            <directionalLight
                position={[0, -15, -0]}
                intensity={4}
                color={new Color(`#${shapeSettings.colors[1]}`)}
            />
            <Physics gravity={[0, 0, 0]}>
                <Pointer />
                {baubles.map((props, i) => (
                    <Bauble
                        key={i}
                        {...props}
                        shapeSettings={shapeSettings}
                    />
                ))}
            </Physics>
            <Environment files="/assets/adamsbridge.hdr" />
            <EffectComposer
                multisampling={0}
                enableNormalPass
            >
                <SSAO
                    samples={11}
                    radius={0.15}
                    intensity={20}
                    luminanceInfluence={0.6}
                    color={new Color(`#${shapeSettings.colors[1]}`)}
                    worldDistanceThreshold={100}
                    worldDistanceFalloff={100}
                    worldProximityThreshold={100}
                    worldProximityFalloff={100}
                />
                <SSAO
                    samples={21}
                    radius={0.03}
                    intensity={15}
                    luminanceInfluence={0.6}
                    color={new Color(`#${shapeSettings.colors[1]}`)}
                    worldDistanceThreshold={100}
                    worldDistanceFalloff={100}
                    worldProximityThreshold={100}
                    worldProximityFalloff={100}
                />
            </EffectComposer>
        </Canvas>
    );
}

const Bauble = ({
    vec = new Vector3(),
    scale = 1,
    r = MathUtils.randFloatSpread,
    shapeSettings = { ...defaultSettingsByShape.xmasBallpit },
}) => {
    const baubleMaterial = new MeshLambertMaterial({
        color: `#${shapeSettings.colors[0]}`,
        emissive: `#${shapeSettings.colors[0]}`
    })
    const capMaterial = new MeshStandardMaterial({
        metalness: 1,
        roughness: 0.15,
        color: `#${shapeSettings.colors[2]}`,
        emissive: `#${shapeSettings.colors[2]}`,
        envMapIntensity: 20
    })
    const sphereGeometry = new SphereGeometry(1, 28, 28)
    const { nodes } = useGLTF("/assets/cap.glb")
    const api = useRef<RapierRigidBody>(null)
    useFrame((state, delta) => {
        delta = Math.min(0.1, delta)
        api?.current?.applyImpulse(
            vec.copy(api.current.translation())
                .normalize()
                .multiply({ x: -50 * delta * scale, y: -150 * delta * scale, z: -50 * delta * scale }),
            true
        )
    })
    return (
        <RigidBody
            linearDamping={0.75}
            angularDamping={0.15}
            friction={0.2}
            position={[r(20), r(20) - 25, r(20) - 10]}
            ref={api}
            colliders={false}
        >
            <BallCollider args={[scale]} />
            <CylinderCollider
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, 0, 1.2 * scale]}
                args={[0.15 * scale, 0.275 * scale]}
            />
            <mesh
                castShadow
                receiveShadow
                scale={scale}
                geometry={sphereGeometry}
                material={baubleMaterial}
            />
            <mesh
                castShadow
                scale={2.5 * scale}
                position={[0, 0, -1.8 * scale]}
                geometry={(nodes?.Mesh_1 as Mesh)?.geometry}
                material={capMaterial}
            />
        </RigidBody>
    )
}

const Pointer = ({ vec = new Vector3() }) => {
    const ref = useRef<RapierRigidBody>(null)
    useFrame(({ mouse, viewport }) => {
        vec.lerp({ x: (mouse.x * viewport.width) / 2, y: (mouse.y * viewport.height) / 2, z: 0 }, 0.2)
        ref?.current?.setNextKinematicTranslation(vec)
    })
    return (
        <RigidBody
            position={[100, 100, 100]}
            type="kinematicPosition"
            colliders={false}
            ref={ref}
        >
            <BallCollider args={[2]} />
        </RigidBody>
    )
}