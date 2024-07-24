// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { Physics, usePlane, useSphere } from "@react-three/cannon"
// import { EffectComposer, SSAO, Bloom } from "@react-three/postprocessing"
// import { BufferGeometry, Color, InstancedMesh } from "three";

// import { shapeSettingsType } from "@utils/types";
// import { defaultSettingsByShape } from '@utils/statics';
// import { Text } from "@react-three/drei";

import * as THREE from "three";
import React, { RefObject, forwardRef, useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, GodRays } from "@react-three/postprocessing";
import { BlendFunction, Resizer, KernelSize } from "postprocessing";
import { Center, OrbitControls, useMatcapTexture, Text3D, Text } from "@react-three/drei";

interface TextParticlesPropsTypes {
};

const getIsMobile = () => {
    if (typeof window === "undefined") {
        return false
    }
    return ((window.innerWidth <= 961));
}

const isMobile = getIsMobile()

export const TextParticles = ({
}: TextParticlesPropsTypes) => {

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'black'
            }}
        >
            <Canvas >
                <pointLight position={[5, 5, 5]} />
                <Center>
                    <CustomText />
                </Center>
                <Effects />
                <OrbitControls
                    minPolarAngle={Math.PI / 2}
                    maxPolarAngle={Math.PI / 2}
                    minAzimuthAngle={-Math.PI / 3}
                    maxAzimuthAngle={Math.PI / 3}
                    // minPolarAngle={Math.PI / 4}
                    // maxPolarAngle={-Math.PI / 4}
                    enableZoom={false}
                    enablePan={false}
                />
                {/* <OrbitControls /> */}
            </Canvas>
        </div>
    );
}

const CustomText = () => {

    const [matcapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256)

    return (
        <Text3D
            font="/assets/fonts/helvetiker_regular.typeface.json"
            size={isMobile ? 0.2 : 0.75}
            height={0.2}
            curveSegments={100}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={50}
            letterSpacing={0.1}
        // font={
        //     "https://rawcdn.githack.com/google/fonts/3b179b729ac3306ab2a249d848d94ff08b90a0af/apache/robotoslab/static/RobotoSlab-Black.ttf"
        // }
        // scale={[8, 8, 8]}
        // color="#FF0000" // default
        // anchorX="center" // default
        // anchorY="middle" // default
        >
            3D EMBED
            <meshMatcapMaterial
                matcap={matcapTexture}

            />
            {/* <meshNormalMaterial /> */}
        </Text3D>

    )
}

const Effects = () => {
    const [shouldRerender, setShouldRerender] = useState(false)
    const sunRef = useRef(null)
    useEffect(() => {
        setShouldRerender(true)
    }, [sunRef.current])

    return (
        <>
            <Sun sunRef={sunRef} />
            {sunRef.current && (
                <EffectComposer multisampling={0}>
                    <GodRays
                        sun={sunRef.current}
                        blendFunction={BlendFunction.SCREEN}
                        samples={60}
                        density={0.97}
                        decay={0.96}
                        weight={0.5}
                        exposure={1}
                        clampMax={1}
                        // width={100}
                        // height={100}
                        kernelSize={KernelSize.MEDIUM}
                        blur={true}

                    />
                </EffectComposer>
            )}
        </>
    );
}

const Sun = ({ sunRef }: { sunRef: RefObject<any> }) => {
    const mouseCoordinates = useRef({ x: 0, y: 0 })

    if (typeof addEventListener !== "undefined" && typeof window !== undefined) {
        addEventListener("mousemove", (event) => {
            mouseCoordinates.current = {
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: (event.clientY / window.innerHeight) * 2 - 1,
            }
        })
    }

    useFrame(({ mouse, viewport, clock }) => {
        // const mouseCoordinates = { x: (mouse.x * viewport.width) / 2, y: (mouse.y * viewport.height) / 2, z: -0.1 }
        const mouseCoordinatesToUse = {
            x: (mouseCoordinates.current.x * viewport.width) / 2,
            y: (mouseCoordinates.current.y * viewport.height) / 2 * -1,
        }
        sunRef.current.position.x = mouseCoordinatesToUse.x
        sunRef.current.position.y = mouseCoordinatesToUse.y
    })

    return (
        <mesh ref={sunRef} position={[0, 0, -1.5]}>
            <sphereGeometry args={[isMobile ? 0.3 : 1, 36, 36]} />
            <meshBasicMaterial color={"#FF00FF"} />
        </mesh>
    );
}

// function Particle(x,y){
//   this.x =  Math.random()*ww;
//   this.y =  Math.random()*wh;
//   this.dest = {
//     x : x,
//     y: y
//   };
//   this.r =  Math.random()*5 + 2;
//   this.vx = (Math.random()-0.5)*20;
//   this.vy = (Math.random()-0.5)*20;
//   this.accX = 0;
//   this.accY = 0;
//   this.friction = Math.random()*0.05 + 0.94;

//   this.color = colors[Math.floor(Math.random()*6)];
// }

var colors = ["#468966", "#FFF0A5", "#FFB03B", "#B64926", "#8E2800"];

// var canvas = document.querySelector("#scene"),
//   ctx = canvas.getContext("2d"),
//   particles = [],
//   amount = 0,
//   mouse = {x:0,y:0},
//   radius = 1;

// var colors = ["#468966","#FFF0A5", "#FFB03B","#B64926", "#8E2800"];

// var copy = document.querySelector("#copy");

// var ww = canvas.width = window.innerWidth;
// var wh = canvas.height = window.innerHeight;



// Particle.prototype.render = function() {


//   this.accX = (this.dest.x - this.x)/1000;
//   this.accY = (this.dest.y - this.y)/1000;
//   this.vx += this.accX;
//   this.vy += this.accY;
//   this.vx *= this.friction;
//   this.vy *= this.friction;

//   this.x += this.vx;
//   this.y +=  this.vy;

//   ctx.fillStyle = this.color;
//   ctx.beginPath();
//   ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
//   ctx.fill();

//   var a = this.x - mouse.x;
//   var b = this.y - mouse.y;

//   var distance = Math.sqrt( a*a + b*b );
//   if(distance<(radius*70)){
//     this.accX = (this.x - mouse.x)/100;
//     this.accY = (this.y - mouse.y)/100;
//     this.vx += this.accX;
//     this.vy += this.accY;
//   }

// }

// function onMouseMove(e){
//   mouse.x = e.clientX;
//   mouse.y = e.clientY;
// }

// function onTouchMove(e){
//   if(e.touches.length > 0 ){
//     mouse.x = e.touches[0].clientX;
//     mouse.y = e.touches[0].clientY;
//   }
// }

// function onTouchEnd(e){
// mouse.x = -9999;
// mouse.y = -9999;
// }

// function initScene(){
//   ww = canvas.width = window.innerWidth;
//   wh = canvas.height = window.innerHeight;

//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   ctx.font = "bold "+(ww/10)+"px sans-serif";
//   ctx.textAlign = "center";
//   ctx.fillText(copy.value, ww/2, wh/2);

//   var data  = ctx.getImageData(0, 0, ww, wh).data;
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.globalCompositeOperation = "screen";

//   particles = [];
//   for(var i=0;i<ww;i+=Math.round(ww/150)){
//     for(var j=0;j<wh;j+=Math.round(ww/150)){
//       if(data[ ((i + j*ww)*4) + 3] > 150){
//         particles.push(new Particle(i,j));
//       }
//     }
//   }
//   amount = particles.length;

// }

// function onMouseClick(){
//   radius++;
//   if(radius ===5){
//     radius = 0;
//   }
// }

// function render(a) {
//   requestAnimationFrame(render);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   for (var i = 0; i < amount; i++) {
//     particles[i].render();
//   }
// };

// copy.addEventListener("keyup", initScene);
// window.addEventListener("resize", initScene);
// window.addEventListener("mousemove", onMouseMove);
// window.addEventListener("touchmove", onTouchMove);
// window.addEventListener("click", onMouseClick);
// window.addEventListener("touchend", onTouchEnd);
// initScene();
// requestAnimationFrame(render);

