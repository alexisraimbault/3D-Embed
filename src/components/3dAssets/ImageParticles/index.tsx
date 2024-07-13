import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
    Color,
} from "three";
import * as THREE from "three";
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { shapeSettingsType } from "@utils/types";
import { defaultSettingsByShape } from "@utils/statics";
import { storage } from '@utils/firebase';

interface ImageParticlesPropsTypes {
    interaction?: string,
    shapeSettings?: shapeSettingsType,
    isSidebar?: boolean,
};

export const ImageParticles = ({
    shapeSettings = { ...defaultSettingsByShape.imageParticles },
    isSidebar = false,
}: ImageParticlesPropsTypes) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera>(null)
    const [firebaseImageUrl, setFirebaseImageUrl] = useState('')

    const imageName = shapeSettings.images[0]

    useEffect(() => {
        if (imageName && imageName.length > 0) {
            fetchImage()
        }
    }, [imageName])

    const fetchImage = async () => {
        const imagePath = `uploads/${imageName}`
        const imageUrlRes = await getDownloadURL(ref(storage, imagePath));
        setFirebaseImageUrl(imageUrlRes)
    }

    return (
        <div
            ref={containerRef}
            style={{ height: '100%' }}
        >
            <Canvas
            >
                <PerspectiveCamera
                    ref={cameraRef}
                    makeDefault
                    fov={35}
                    position={[0, 0, 18]}
                    near={0.1}
                    far={100}
                    aspect={1}
                />
                {firebaseImageUrl.length > 0 && (
                    <ImageDisplay
                        shapeSettings={shapeSettings}
                        firebaseImageUrl={firebaseImageUrl}
                        containerRef={containerRef}
                        cameraRef={cameraRef}
                    />
                )}
                {!isSidebar && <OrbitControls />}
            </Canvas>
        </div>
    );
}

const ImageDisplay = ({
    shapeSettings,
    firebaseImageUrl,
    containerRef,
    cameraRef,
}: {
    shapeSettings: shapeSettingsType,
    firebaseImageUrl: string,
    containerRef: RefObject<HTMLDivElement>,
    cameraRef: RefObject<THREE.PerspectiveCamera>
}) => {
    const { gl } = useThree()
    const particlesGeometryRef = useRef<THREE.PlaneGeometry>(null)
    const customisationSettings = {
        colorFrom: new Color(`#${shapeSettings.colors[0]}`),
        colorTo: new Color(`#${shapeSettings.colors[1]}`),
        cursorSize: shapeSettings.metrics[0],
        particleSize: shapeSettings.metrics[1],
        grayscaleBoost: shapeSettings.metrics[2],
        grayscaleInverter: shapeSettings.metrics[3] === 1,
        visibilityThreshold: shapeSettings.metrics[4],
        displacementIntensity: shapeSettings.metrics[5],
    }


    const particlesVertexShader = `
    uniform float uSize;
    uniform sampler2D uPictureTexture;
    uniform sampler2D uDisplacementTexture;
    uniform float uGrayscaleBoost;
    uniform bool uGrayscaleInverter;
    uniform float uDisplacementIntensity;

    attribute float aIntensity;
    attribute float aPhi;
    attribute float aTheta;

    // varying vec3 vColor;
    varying float vIntensity;
    varying float vDisplacementIntensity;

    void main()
    {
        // Displacement 
        vec3 newPosition = position;
        float displacementIntensity = texture(uDisplacementTexture, uv).r;
        displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);
        vDisplacementIntensity = displacementIntensity;
    
        // vec3 displacement = vec3(
        //     cos(aTheta) * 0.2,
        //     sin(aTheta) * 0.2,
        //     0.6 * 0.2
        // );
        float displacementScale = 0.1;
        vec3 displacement = vec3(
            sin(aPhi) * cos(aTheta) * displacementScale,
            sin(aPhi) * sin(aTheta) * displacementScale,
            cos(aPhi) * displacementScale
        );
        displacement = normalize(displacement);
        displacement *= displacementIntensity;
        displacement *= uDisplacementIntensity;
        displacement *= aIntensity;

        newPosition += displacement;

        // Final position
        vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;

        // Picture
        float pictureIntensity = texture(uPictureTexture, uv).r;
        if(uGrayscaleInverter) {
            pictureIntensity = 1.0 - pictureIntensity;
        } 
        pictureIntensity += uGrayscaleBoost;
        pictureIntensity = min(pictureIntensity, 1.0);
        pictureIntensity = max(pictureIntensity, 0.0);

        // Point size
        gl_PointSize = uSize * pictureIntensity;
        gl_PointSize *= (1.0 / - viewPosition.z);

        // Varyings
        // vColor = vec3(pow(pictureIntensity, 2.0));
        vIntensity = pictureIntensity;
    }
    `
    const particlesFragmentShader = `
    uniform float uVisibilityThreshold;
    uniform vec3 uColorFrom;
    uniform vec3 uColorTo;

    // varying vec3 vColor;
    varying float vIntensity;
    varying float vDisplacementIntensity;

    void main()
    {
        vec2 uv = gl_PointCoord;
        float distanceToCenter = length(uv - vec2(0.5));
        if(distanceToCenter > 0.5) {
            discard;
        }
        if(vIntensity < uVisibilityThreshold) {
            discard;
        }

        vec3 blackColor = vec3(0.0);
        vec3 baseColorFrom = mix(blackColor, uColorFrom, vIntensity);
        vec3 baseColorTo = mix(blackColor, uColorTo, vIntensity);
        vec3 finalColor = mix(baseColorFrom, baseColorTo, vDisplacementIntensity);

        gl_FragColor = vec4(finalColor, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }
    `
    gl.setPixelRatio(Math.min(2, window.devicePixelRatio))
    // const loadedTexture = firebaseImageUrl.length > 0 ?
    //     useTexture(firebaseImageUrl) :
    //     null
    const loadedTexture = useTexture(firebaseImageUrl)

    const displacement: {
        canvas?: HTMLCanvasElement,
        context?: CanvasRenderingContext2D | null,
        glowImage?: HTMLImageElement,
        raycaster?: THREE.Raycaster,
        screenCursor?: THREE.Vector2,
        canvasCursor?: THREE.Vector2,
        canvasCursorPrevious?: THREE.Vector2,
        interactivePlane?: RefObject<THREE.Mesh>,
        texture?: THREE.CanvasTexture,
    } = {}
    displacement.canvas = document.createElement('canvas')
    // displacement.canvas.width = 128
    // displacement.canvas.height = 128
    // displacement.canvas.style.position = "fixed"
    // displacement.canvas.style.top = '0'
    // displacement.canvas.style.left = '200px'
    // displacement.canvas.style.width = "256px"
    // displacement.canvas.style.height = "256px"
    // displacement.canvas.style.zIndex = "10"
    // document.body.append(displacement.canvas)

    displacement.context = displacement.canvas.getContext("2d")
    displacement.context?.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

    displacement.glowImage = new Image()
    displacement.glowImage.src = '/assets/glow.png'

    displacement.raycaster = new THREE.Raycaster()
    displacement.interactivePlane = useRef(null)

    displacement.screenCursor = new THREE.Vector2(9999, 9999)
    displacement.canvasCursor = new THREE.Vector2(9999, 9999)
    displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999)


    // Texture
    displacement.texture = new THREE.CanvasTexture(displacement.canvas)

    if (cameraRef.current) {
        displacement.raycaster.setFromCamera(displacement.screenCursor, cameraRef.current)
    }

    window.addEventListener('pointermove', (event) => {
        if (displacement.screenCursor === undefined) {
            return;
        }

        if (!containerRef.current) {
            return
        }

        if (!event.target) {
            return
        }

        const containerBoundingClient = containerRef.current.getBoundingClientRect()

        // TODO maybe min / max -1 <-> 1
        const relativeCoords = {
            x: ((event.clientX - containerBoundingClient.left) / containerBoundingClient.width) * 2 - 1,
            y: ((event.clientY - containerBoundingClient.top) / containerBoundingClient.height) * 2 - 1,
        }

        displacement.screenCursor.x = relativeCoords.x
        displacement.screenCursor.y = relativeCoords.y
    })

    useFrame(() => {
        if (
            particlesGeometryRef?.current?.attributes?.position?.count &&
            (
                !particlesGeometryRef?.current?.attributes?.aIntensity ||
                !particlesGeometryRef?.current?.attributes?.aPhi ||
                !particlesGeometryRef?.current?.attributes?.aTheta
            )
        ) {
            const nbParticles = particlesGeometryRef.current.attributes.position.count

            const intensitiesArray = new Float32Array(nbParticles)
            const anglesArray = new Float32Array(nbParticles)
            const angles2Array = new Float32Array(nbParticles)

            particlesGeometryRef.current.attributes.aIntensity = new THREE.BufferAttribute(intensitiesArray, 1)
            particlesGeometryRef.current.attributes.aPhi = new THREE.BufferAttribute(anglesArray, 1)
            particlesGeometryRef.current.attributes.aTheta = new THREE.BufferAttribute(angles2Array, 1)
            particlesGeometryRef.current.deleteAttribute('normal')
            // particlesGeometryRef.current.needsUpdate = true

            for (let i = 0; i < nbParticles; i++) {
                intensitiesArray[i] = Math.random()
                anglesArray[i] = Math.random() * Math.PI
                angles2Array[i] = Math.random() * Math.PI * 2
            }
        }

        if (cameraRef.current && displacement.raycaster && displacement.screenCursor) {
            displacement.raycaster.setFromCamera(displacement.screenCursor, cameraRef.current)
        }
        let intersections: THREE.Intersection[] = []

        if (displacement.interactivePlane?.current && displacement.raycaster) {
            intersections = displacement.raycaster.intersectObject(displacement.interactivePlane.current as THREE.Object3D<THREE.Object3DEventMap>)
        }

        if (intersections.length) {
            const uv = intersections[0].uv
            if (displacement.canvasCursor && displacement.canvas && uv) {
                displacement.canvasCursor.x = uv.x * displacement.canvas.width
                displacement.canvasCursor.y = uv.y * displacement.canvas.height
            }
        }


        if (
            displacement.canvas &&
            displacement.context &&
            displacement.glowImage &&
            displacement.canvasCursor &&
            displacement.texture &&
            displacement.canvasCursorPrevious
        ) {
            // Displacement
            // Fade out
            displacement.context.globalCompositeOperation = 'source-over'
            displacement.context.globalAlpha = 0.02
            displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

            // Speed alpha
            const cursorDistance = displacement.canvasCursorPrevious.distanceTo(displacement.canvasCursor)
            displacement.canvasCursorPrevious.copy(displacement.canvasCursor)
            const alpha = Math.min(cursorDistance * 0.05, 1)

            // Draw glow
            const glowSize = displacement.canvas.width * (customisationSettings.cursorSize * 0.20 / 5)
            displacement.context.globalCompositeOperation = 'lighten'
            displacement.context.globalAlpha = alpha
            displacement.context.drawImage(
                displacement.glowImage,
                displacement.canvasCursor.x - glowSize * 0.5,
                displacement.canvasCursor.y - glowSize * 0.5,
                glowSize,
                glowSize
            )

            // Texture
            displacement.texture.needsUpdate = true
        }
    })

    return (
        <>
            <points>
                <planeGeometry
                    args={[10, 10, 128, 128]}
                    ref={particlesGeometryRef}
                >
                </planeGeometry>
                <shaderMaterial
                    vertexShader={particlesVertexShader}
                    fragmentShader={particlesFragmentShader}
                    uniforms={{
                        uSize: { value: (customisationSettings.particleSize * 90 / 5) * gl.getPixelRatio() },
                        uPictureTexture: { value: loadedTexture },
                        uDisplacementTexture: { value: displacement.texture },
                        uVisibilityThreshold: { value: customisationSettings.visibilityThreshold },
                        uGrayscaleBoost: { value: customisationSettings.grayscaleBoost },
                        uGrayscaleInverter: { value: customisationSettings.grayscaleInverter },
                        uColorFrom: { value: customisationSettings.colorFrom },
                        uColorTo: { value: customisationSettings.colorTo },
                        uDisplacementIntensity: { value: customisationSettings.displacementIntensity * 1.5 / 5 }
                    }}
                />
            </points>
            <mesh
                ref={displacement.interactivePlane}
                visible={false}
            >
                <planeGeometry
                    args={[10, 10]}
                />
                <meshBasicMaterial
                    color={new Color('#ff0000')}
                    wireframe
                    side={THREE.DoubleSide}
                />
            </mesh>
        </>
    )
}