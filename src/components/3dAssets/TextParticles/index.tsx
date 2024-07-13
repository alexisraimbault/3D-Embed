import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, usePlane, useSphere } from "@react-three/cannon"
import { EffectComposer, SSAO, Bloom } from "@react-three/postprocessing"
import { BufferGeometry, Color, InstancedMesh } from "three";

import { shapeSettingsType } from "@utils/types";
import { defaultSettingsByShape } from '@utils/statics';
import { Text } from "@react-three/drei";

interface TextParticlesPropsTypes {
    shapeSettings?: shapeSettingsType
};

export const TextParticles = ({
    shapeSettings = { ...defaultSettingsByShape.ballPit },
}: TextParticlesPropsTypes) => {

    return (
        <Canvas >
            <pointLight position={[5, 5, 5]} />
            <Text
                scale={[10, 10, 10]}
                color="black" // default
                anchorX="center" // default
                anchorY="middle" // default
            >
                HELLO WORLD
            </Text>
            {/* <OrbitControls /> */}
        </Canvas>
    );
}

var colors = ["#468966", "#FFF0A5", "#FFB03B", "#B64926", "#8E2800"];
