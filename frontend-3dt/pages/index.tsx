import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import LargeBox from '../components/LargeBox'
import CustomStars from '../components/CustomStars'
import { Text } from '@react-three/drei'
import fonts from '../public/fonts.js'
import {colors} from '../public/constants.js'
import HelpMenu from '../components/Help/HelpMenu'


const Scene = () => {
  
  return (
    <div>
      <HelpMenu />
      
      <Canvas camera={{position: [0, 0, 11]}}
        style={{position: 'absolute',
                width: '100%',
                height: '100%'
              }}
      >
        <color attach="background" args={["black"]}></color>
        <group>
          <Text font={fonts.Philosopher} color={colors.brightOrange} anchorX='center' anchorY='middle'
            position={[0, 5, 0]}
            fontSize={2} >
              Welcome to
          </Text>
          <Text font={fonts.Philosopher} color={colors.brightOrange} anchorX='center' anchorY='middle'
            position={[0, 3, 0]}
            fontSize={2} >
              3D tic-tac-toe!
          </Text>
        </group>
        <OrbitControls target={[0, 0, 0]} />
        {/* <Stars radius={100} depth={1} count={5000} factor={4} saturation={0}
          // fade
        />  */}
        <CustomStars count={1500}></CustomStars>
        {/* <Cloud /> */}
        {/* <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.5} /> */}
        
        <spotLight position={[10, 15, 10]} angle={0.3}></spotLight>
        <ambientLight intensity={0.5} />
        {/* <mesh>
          <sphereGeometry attach="geometry" args={[1000, 16, 16]}/>
          <meshStandardMaterial attach="material"
                      color={constants.yellowEdge}
        
                      />
        </mesh> */}
        <LargeBox />
      </Canvas>
    </div>
  )
};


export default Scene
