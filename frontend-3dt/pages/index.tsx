import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, Vector3 } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Stars, Sky, Cloud, Backdrop } from '@react-three/drei'
import SingleBox from './SingleBox'
import CustomStars from './CustomStars'


const deg2rad = (degrees:number) => degrees * (Math.PI / 180);

const boxSize = 1;
const shiftFactor = 1

function LargeBox(props: JSX.IntrinsicElements['mesh']) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  
  // useFrame((state, delta) => {mesh.current.rotation.x += 0.01;
  //     mesh.current.rotation.y += 0.01;
  //   })

  const arrayOfGeoms = useMemo(() => {
    let array = new Array(9);
    for (let i = 0 ; i < 27; i++) {
      array[i] = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    }
    return array}, [])

  return (
    <mesh rotation={[deg2rad(0), deg2rad(0), deg2rad(0)]}
      {...props}
      ref={mesh}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      >
      {arrayOfGeoms.map(
        (x, i) => (
                <lineSegments position={[Math.floor(i/9) - boxSize * shiftFactor, Math.floor(i %9 / 3) - boxSize * shiftFactor, (i%3) - boxSize * shiftFactor]}>
                  <edgesGeometry attach="geometry" args={[x]}></edgesGeometry>
                  <lineBasicMaterial color="#debd3c" attach="material" />
                </lineSegments>
              )
        )}
        {arrayOfGeoms.map(
        (x, i) => (
                <SingleBox position={[Math.floor(i/9) - boxSize * shiftFactor, Math.floor(i %9 / 3) - boxSize * shiftFactor, (i%3) - boxSize * shiftFactor]}></SingleBox>
              )
        )}
      
        
    </mesh>
  )
}



const Scene = () => {
  // ray case
  function onClick() {

  }
  return (
    <Canvas camera={{position: [0, 0, 5]}}
      style={{position: 'absolute',
              width: '100%',
              height: '100%'
            }}
    >
      <color attach="background" args={["black"]}></color>
      <OrbitControls target={[0, 0, 0]} />
      <Stars radius={100} depth={1} count={5000} factor={4} saturation={0} fade/>
      {/* <CustomStars ></CustomStars> */}
      {/* <Cloud /> */}
      {/* <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.5} /> */}
      
      <spotLight position={[10, 15, 10]} angle={0.3}></spotLight>
      <ambientLight intensity={0.5} />
      <mesh>
        <sphereGeometry attach="geometry" args={[1000, 16, 16]}/>
        <meshStandardMaterial attach="material"
                    color={"black"}
                    transparent={true}
                    opacity={0.4}
                    />
      </mesh>
      <LargeBox />
    </Canvas>
  )
};


export default Scene
