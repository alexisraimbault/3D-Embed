import './styles.scss';

import {
    Canvas, useFrame, useThree
} from "@react-three/fiber";
import { Physics, usePlane, useSphere } from "@react-three/cannon"
import { EffectComposer, SSAO, Bloom } from "@react-three/postprocessing"
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, CustomBlending, InstancedMesh, NormalBlending, ShaderMaterial } from "three";
import { useRef } from "react";
import { OrbitControls, Text } from "@react-three/drei";
import { glsl } from "three/examples/jsm/nodes/Nodes.js";

import { shapeSettingsType } from "@utils/types";
import { defaultSettingsByShape } from '@utils/statics';
import { cloneDeep } from "@utils/methods";

interface MouseTrailPropsTypes {
    shapeSettings?: shapeSettingsType
};

export const MouseTrail = ({
    shapeSettings = { ...defaultSettingsByShape.ballPit },
}: MouseTrailPropsTypes) => {

    return (
        <div
            className='mousetrail__wrapper'
        >
            <Canvas
                camera={{ position: [0, 0, 20], fov: 50, near: 17, far: 40 }}
                shadows gl={{ stencil: false, antialias: false }}
            // orthographic
            >
                {/* <color attach="background" args={[`#000000`]} /> */}
                <ambientLight intensity={1.0} />
                <directionalLight
                    position={[-10, -10, -5]}
                    intensity={0.5}
                />
                <directionalLight
                    castShadow
                    intensity={4}
                    position={[50, 50, 25]}
                    shadow-mapSize={[256, 256]}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                />
                <Particles />
                {/* <OrbitControls /> */}
            </Canvas>

        </div>
    );
}

// const randomizeAroundPosition = (
//     position: { x: number, y: number, z: number },
//     interval = 0.5
// ) => {

//     const randomizedAngle = Math.random() * Math.PI * 2
//     const randomizedLength = Math.sqrt(Math.random()) * interval
//     return ({
//         x: position.x + (Math.cos(randomizedAngle) * randomizedLength),
//         y: position.y + (Math.sin(randomizedAngle) * randomizedLength),
//         z: position.z + (Math.tan(randomizedAngle) * randomizedLength),
//     })
// }

const Particles = () => {
    const { gl } = useThree()

    gl.setPixelRatio(Math.min(2, window.devicePixelRatio))

    const bufferAttributePositionRef = useRef<BufferAttribute>(null)
    const bufferAttributelifetimeRef = useRef<BufferAttribute>(null)
    const bufferAttributeDeltaRef = useRef<BufferAttribute>(null)
    const bufferAttributeRandomRef = useRef<BufferAttribute>(null)
    const bufferAttributeRandom2Ref = useRef<BufferAttribute>(null)
    const bufferAttributeScaleRef = useRef<BufferAttribute>(null)

    const shaderRef = useRef<ShaderMaterial>(null)
    const OUTSIDE_COORDINATE = 100000

    const PARTICLE_LIFETIME = 4.0
    const particlesCount = 40000;

    const particlePositions = new Float32Array(particlesCount * 3);
    const lifetimeArray = new Float32Array(particlesCount);
    const particleDeltaArray = new Float32Array(particlesCount);
    const particleRandomnessArray = new Float32Array(particlesCount);
    const particleRandomnessArray2 = new Float32Array(particlesCount);
    const particleScaleArray = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const randomizedAngle = Math.random() * 0.04 + 0.01
        const randomizedLength = Math.random() * 0.4 + 0.5
        const randomizedLifetime = Math.random() * PARTICLE_LIFETIME

        particlePositions[i3] = OUTSIDE_COORDINATE;
        particlePositions[i3 + 1] = 0;
        particlePositions[i3 + 2] = 0;

        lifetimeArray[i] = randomizedLifetime
        particleDeltaArray[i] = 0
        particleRandomnessArray[i] = randomizedAngle
        particleRandomnessArray2[i] = randomizedLength
        particleScaleArray[i] = Math.random()
    }

    const mouseCoordinates = useRef({ x: 0, y: 0 })

    if (typeof addEventListener !== "undefined" && typeof window !== undefined) {
        addEventListener("mousemove", (event) => {
            mouseCoordinates.current = {
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: (event.clientY / window.innerHeight) * 2 - 1,
            }
            console.log('new', mouseCoordinates.current.x, mouseCoordinates.current.y)
        })
    }

    useFrame(({ mouse, viewport, clock }, delta) => {
        const elapsedTime = clock.getElapsedTime()
        const mouseCoordinatesOld = { x: (mouse.x * viewport.width) / 2, y: (mouse.y * viewport.height) / 2, z: -0.1 }
        const mouseCoordinatesToUse = {
            x: (mouseCoordinates.current.x * viewport.width) / 2,
            y: (mouseCoordinates.current.y * viewport.height) / 2 * -1,
        }
        console.log('old', mouse.x, mouse.y)
        // const windowEvent = window.event;

        // if(windowEvent) {
        //     var posX = windowEvent.clientX;
        //     var posY = windowEvent.clientY;

        // }

        // Aging particles
        if (
            bufferAttributeDeltaRef.current &&
            bufferAttributePositionRef.current &&
            bufferAttributeRandomRef.current &&
            bufferAttributeRandom2Ref.current
        ) {
            for (let i = 0; i < particlesCount; i++) {

                const spawnTime = bufferAttributeDeltaRef.current.array[i]
                let lifetime = elapsedTime - spawnTime

                if ((spawnTime === 0 && i <= elapsedTime * particlesCount / PARTICLE_LIFETIME) || lifetime > PARTICLE_LIFETIME) {
                    const i3 = i * 3;
                    const randomizedAngle = Math.random() * Math.PI * 2
                    const randomizedLength = Math.sqrt(Math.random()) * 0.7

                    const radius = 1;
                    const phi = Math.random() * Math.PI;
                    const theta = Math.random() * Math.PI * 2;

                    const varyingX = Math.sin(phi) * Math.cos(theta) * radius
                    const varyingY = Math.sin(phi) * Math.sin(theta) * radius
                    const varyingZ = Math.cos(phi) * radius

                    // bufferAttributePositionRef.current.array[i3] = mouseCoordinates.x + r * Math.cos(randomizedAngle) * randomizedLength
                    // bufferAttributePositionRef.current.array[i3 + 1] = mouseCoordinates.y + Math.sin(randomizedAngle) * randomizedLength
                    bufferAttributePositionRef.current.array[i3] = mouseCoordinatesToUse.x + varyingX
                    bufferAttributePositionRef.current.array[i3 + 1] = mouseCoordinatesToUse.y + varyingY
                    bufferAttributePositionRef.current.array[i3 + 2] = -0.1 + varyingZ;

                    bufferAttributeDeltaRef.current.array[i] = elapsedTime

                    bufferAttributeRandomRef.current.array[i] = randomizedAngle
                    bufferAttributeRandom2Ref.current.array[i] = randomizedLength
                }
            }
        }

        if (shaderRef && shaderRef.current) {
            shaderRef.current.uniforms.uMousePosition.value = mouseCoordinates
            shaderRef.current.uniforms.uTime.value = elapsedTime
        }

        if (bufferAttributePositionRef?.current) {
            bufferAttributePositionRef.current.needsUpdate = true
        }

        if (bufferAttributeDeltaRef?.current) {
            bufferAttributeDeltaRef.current.needsUpdate = true
        }

        if (bufferAttributeRandomRef?.current) {
            bufferAttributeRandomRef.current.needsUpdate = true
        }

        if (bufferAttributeRandom2Ref?.current) {
            bufferAttributeRandom2Ref.current.needsUpdate = true
        }
    })

    const vertexShader = `
    vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    float mod289(float x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
    }
    
    float permute(float x) {
        return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float taylorInvSqrt(float r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    vec4 grad4(float j, vec4 ip) {
        const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
        vec4 p,s;
    
        p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
        p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
        s = vec4(lessThan(p, vec4(0.0)));
        p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
    
        return p;
    }
    
    #define F4 0.309016994374947451
    
    vec4 simplexNoiseDerivatives (vec4 v) {
        const vec4  C = vec4( 0.138196601125011,0.276393202250021,0.414589803375032,-0.447213595499958);
    
        vec4 i  = floor(v + dot(v, vec4(F4)) );
        vec4 x0 = v -   i + dot(i, C.xxxx);
    
        vec4 i0;
        vec3 isX = step( x0.yzw, x0.xxx );
        vec3 isYZ = step( x0.zww, x0.yyz );
        i0.x = isX.x + isX.y + isX.z;
        i0.yzw = 1.0 - isX;
        i0.y += isYZ.x + isYZ.y;
        i0.zw += 1.0 - isYZ.xy;
        i0.z += isYZ.z;
        i0.w += 1.0 - isYZ.z;
    
        vec4 i3 = clamp( i0, 0.0, 1.0 );
        vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
        vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
    
        vec4 x1 = x0 - i1 + C.xxxx;
        vec4 x2 = x0 - i2 + C.yyyy;
        vec4 x3 = x0 - i3 + C.zzzz;
        vec4 x4 = x0 + C.wwww;
    
        i = mod289(i);
        float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
        vec4 j1 = permute( permute( permute( permute (
                    i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
                + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
                + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
                + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
    
    
        vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
    
        vec4 p0 = grad4(j0,   ip);
        vec4 p1 = grad4(j1.x, ip);
        vec4 p2 = grad4(j1.y, ip);
        vec4 p3 = grad4(j1.z, ip);
        vec4 p4 = grad4(j1.w, ip);
    
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        p4 *= taylorInvSqrt(dot(p4,p4));
    
        vec3 values0 = vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2)); //value of contributions from each corner at point
        vec2 values1 = vec2(dot(p3, x3), dot(p4, x4));
    
        vec3 m0 = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0); //(0.5 - x^2) where x is the distance
        vec2 m1 = max(0.5 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
    
        vec3 temp0 = -6.0 * m0 * m0 * values0;
        vec2 temp1 = -6.0 * m1 * m1 * values1;
    
        vec3 mmm0 = m0 * m0 * m0;
        vec2 mmm1 = m1 * m1 * m1;
    
        float dx = temp0[0] * x0.x + temp0[1] * x1.x + temp0[2] * x2.x + temp1[0] * x3.x + temp1[1] * x4.x + mmm0[0] * p0.x + mmm0[1] * p1.x + mmm0[2] * p2.x + mmm1[0] * p3.x + mmm1[1] * p4.x;
        float dy = temp0[0] * x0.y + temp0[1] * x1.y + temp0[2] * x2.y + temp1[0] * x3.y + temp1[1] * x4.y + mmm0[0] * p0.y + mmm0[1] * p1.y + mmm0[2] * p2.y + mmm1[0] * p3.y + mmm1[1] * p4.y;
        float dz = temp0[0] * x0.z + temp0[1] * x1.z + temp0[2] * x2.z + temp1[0] * x3.z + temp1[1] * x4.z + mmm0[0] * p0.z + mmm0[1] * p1.z + mmm0[2] * p2.z + mmm1[0] * p3.z + mmm1[1] * p4.z;
        float dw = temp0[0] * x0.w + temp0[1] * x1.w + temp0[2] * x2.w + temp1[0] * x3.w + temp1[1] * x4.w + mmm0[0] * p0.w + mmm0[1] * p1.w + mmm0[2] * p2.w + mmm1[0] * p3.w + mmm1[1] * p4.w;
    
        return vec4(dx, dy, dz, dw) * 49.0;
    }
    
    vec3 curl( in vec3 p, in float noiseTime, in float persistence ) {
    
        vec4 xNoisePotentialDerivatives = vec4(0.0);
        vec4 yNoisePotentialDerivatives = vec4(0.0);
        vec4 zNoisePotentialDerivatives = vec4(0.0);
    
        for (int i = 0; i < 3; ++i) {
    
            float twoPowI = pow(2.0, float(i));
            float scale = 0.5 * twoPowI * pow(persistence, float(i));
    
            xNoisePotentialDerivatives += simplexNoiseDerivatives(vec4(p * twoPowI, noiseTime)) * scale;
            yNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(123.4, 129845.6, -1239.1)) * twoPowI, noiseTime)) * scale;
            zNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(-9519.0, 9051.0, -123.0)) * twoPowI, noiseTime)) * scale;
        }
    
        return vec3(
            zNoisePotentialDerivatives[1] - yNoisePotentialDerivatives[2],
            xNoisePotentialDerivatives[2] - zNoisePotentialDerivatives[0],
            yNoisePotentialDerivatives[0] - xNoisePotentialDerivatives[1]
        );
    
    }
    
    uniform vec3 uMousePosition;
    uniform float uTime;
    uniform float uSize;
    
    attribute float aLifetime;
    attribute float aDeltaLife;
    attribute float aRandomness;
    attribute float aRandomness2;
    attribute float aScale;
    
    varying float vLifeIntensity;
    
    void main() {
        // vec3 positionAroundMouse = position + uMousePosition;
        float curlSize = 0.03;
        // float curlSize = aRandomness;
        float lifeDuration = uTime - aDeltaLife;
        vLifeIntensity = 1.0 - ((${PARTICLE_LIFETIME}.0 - lifeDuration) / ${PARTICLE_LIFETIME}.0);
        float speed = 1.0;
        float randCoeff = 1.5;
        vec3 copyPosition = position;
    
        copyPosition += curl(copyPosition * curlSize * lifeDuration, lifeDuration, aRandomness2);
        // copyPosition += vec3(
        //     cos(aRandomness) * aRandomness2 * lifeDuration * randCoeff,
        //     sin(aRandomness) * aRandomness2 * lifeDuration * randCoeff,
        //     -lifeDuration * 0.5
        // );
        copyPosition += vec3(
            0.0,
            0.0,
            -lifeDuration * 0.5
        );
        // Rotate
        // vec3 p = copyPosition.xyz;
        // copyPosition.x = p.x*cos(lifeDuration) - p.y*sin(lifeDuration);
        // copyPosition.y = p.y*cos(lifeDuration) + p.x*sin(lifeDuration);

        vec4 modelPosition = modelMatrix * vec4(copyPosition, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;

        gl_PointSize = uSize * aScale;
        gl_PointSize *= (1.0 / -viewPosition.z);
    }     
    
    `

    const fragmentShader = `
        varying float vLifeIntensity;

        void main() {
            float strength = distance(gl_PointCoord, vec2(0.5));
            strength = 1.0 - strength;
            if(strength < 0.5) {
                discard;
            }
            // strength = sqrt(strength);
            vec3 customColor = vec3(vLifeIntensity, 0.0, 1.0-vLifeIntensity);
            vec3 customColorMix = mix(
                vec3(0.0), 
                customColor,
                strength
            );
            gl_FragColor = vec4(customColorMix, 1.0);
        }
    `

    return (
        <points
            castShadow
            receiveShadow
        >
            <bufferGeometry>
                <bufferAttribute
                    ref={bufferAttributePositionRef}
                    attach='attributes-position'
                    count={particlesCount}
                    itemSize={3}
                    array={particlePositions}
                />
                <bufferAttribute
                    ref={bufferAttributelifetimeRef}
                    attach='attributes-aLifetime'
                    count={particlesCount}
                    itemSize={1}
                    array={lifetimeArray}
                />
                <bufferAttribute
                    ref={bufferAttributeDeltaRef}
                    attach='attributes-aDeltaLife'
                    count={particlesCount}
                    itemSize={1}
                    array={particleDeltaArray}
                />
                <bufferAttribute
                    ref={bufferAttributeRandomRef}
                    attach='attributes-aRandomness'
                    count={particlesCount}
                    itemSize={1}
                    array={particleRandomnessArray}
                />
                <bufferAttribute
                    ref={bufferAttributeRandom2Ref}
                    attach='attributes-aRandomness2'
                    count={particlesCount}
                    itemSize={1}
                    array={particleRandomnessArray2}
                />
                <bufferAttribute
                    ref={bufferAttributeScaleRef}
                    attach='attributes-aScale'
                    count={particlesCount}
                    itemSize={1}
                    array={particleScaleArray}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={shaderRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                // TODO allow flat or mix
                // blending={AdditiveBlending}
                alphaTest={0.2}
                uniforms={{
                    uMousePosition: { value: { x: 0, y: 0, z: 0 } },
                    uTime: { value: 0 },
                    uSize: { value: 600 * gl.getPixelRatio() }
                }}
            />
        </points>
    );
};
