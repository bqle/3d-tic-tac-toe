import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree, Vector3 } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Stars, Sky, Cloud, Backdrop } from '@react-three/drei'
import SingleBox from './SingleBox'
import CustomStars from './CustomStars'
import {GameStatus} from '../enums/GameStatus'


const deg2rad = (degrees:number) => degrees * (Math.PI / 180);

const boxSize = 1;
const shiftFactor = 1


type LargeBoxProps = JSX.IntrinsicElements['mesh'] & {
  cubeInfo?: Array<GameStatus>
}


function LargeBox(props: LargeBoxProps) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const [gameStatus, setGameStatus] = useState([[[GameStatus.X, GameStatus.O, GameStatus.X],
                                                 [GameStatus.EMPTY, GameStatus.X, GameStatus.EMPTY],
                                                 [GameStatus.X, GameStatus.X, GameStatus.EMPTY]],
                                                [[GameStatus.EMPTY, GameStatus.EMPTY, GameStatus.EMPTY],
                                                 [GameStatus.EMPTY, GameStatus.EMPTY, GameStatus.EMPTY],
                                                 [GameStatus.EMPTY, GameStatus.EMPTY, GameStatus.EMPTY]],
                                                [[GameStatus.EMPTY, GameStatus.EMPTY, GameStatus.EMPTY],
                                                 [GameStatus.EMPTY, GameStatus.EMPTY, GameStatus.EMPTY],
                                                 [GameStatus.EMPTY, GameStatus.EMPTY, GameStatus.EMPTY]]
                                        ]);
  const [highlightCoord, setHighlightCoord] = useState([0, 0, 2]);


  // can be improved
  const arrayOfGeoms = useMemo(() => {
    let array = new Array(27);
    for (let i = 0 ; i < 27; i++) {
      array[i] = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    }
    return array}, [])

  const handleUserKeyPress = useCallback(event => {
    const code = event.code;
    var i = highlightCoord[0];
    var j = highlightCoord[1];
    var k = highlightCoord[2];
    console.log(i, j, k)
    if (code === 'ArrowLeft') { // left arrow - decrease x
      if (i > 0) {
        setHighlightCoord([i -1, j, k])
      }
    } else if (code === 'ArrowUp') { // up arrow -  increase y
      if (j < 2) {
        setHighlightCoord([i, j + 1, k])
      }
    } else if (code === 'ArrowRight') { // right arrow - increase x
      if (i < 2) {
        setHighlightCoord([i + 1, j, k])
      }
    } else if (code === 'ArrowDown') { // down arrow - decrease y
      if (j > 0) {
        setHighlightCoord([i , j - 1, k])
      }
    } else if (code === 'KeyQ') { // q - increase z
      if (k < 2) {
        setHighlightCoord([i , j, k + 1])
      }
    } else if (code === 'KeyE') { // e - decrease z
      if (k > 0) {
        setHighlightCoord([i , j, k - 1])
      }
    }
  }, [highlightCoord])
  
  useEffect(() => {
    console.log('added keydown');
    window.addEventListener('keydown', handleUserKeyPress);
    window.addEventListener('dblclick', clickCenter);
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
      window.removeEventListener('dblclick', clickCenter);
    };
  }, [handleUserKeyPress, clickCenter])
  

  function updateHighlightCoord(i : number, j: number, k: number) {
    console.log(i, j, k);
    setHighlightCoord([i, j, k]);
  }

  function clickCenter() {
    console.log(1, 1, 1);
    setHighlightCoord([1, 1, 1]);
  }
  
  const staticCube = new Array(3).fill(0).map(() => new Array(3).fill(0).map(() => new Array(3).fill(0)))
  return (
    <mesh rotation={[deg2rad(0), deg2rad(0), deg2rad(0)]}
      {...props}
      ref={mesh}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      >
      {arrayOfGeoms.map(
        (x, i) => (
                <lineSegments key={i} position={[Math.floor(i/9) - boxSize * shiftFactor, Math.floor(i %9 / 3) - boxSize * shiftFactor, (i%3) - boxSize * shiftFactor]}>
                  <edgesGeometry attach="geometry" args={[x]}></edgesGeometry>
                  <lineBasicMaterial color="#debd3c" attach="material" />
                </lineSegments>
              )
        )}
        {staticCube.map(
        (iValue, i) => (
          iValue.map(
            (jValue, j) => (
              jValue.map(
                (_, k) => (
                  <SingleBox position={[i - boxSize * shiftFactor, j - boxSize * shiftFactor, k - boxSize * shiftFactor]}
                    highlightStatus = {(i === highlightCoord[0] 
                      && j === highlightCoord[1] 
                      && k === highlightCoord[2]) ? true: false}
                    boxStatus = {gameStatus[i][j][k]}
                    updateHighlightCoord = {() => updateHighlightCoord(i, j, k)}
                  ></SingleBox>
                )
                )
              )
            )
          )
        )}
      
        
    </mesh>
  )
}



const Scene = () => {
  return (
    <Canvas camera={{position: [0, 0, 10]}}
      style={{position: 'absolute',
              width: '100%',
              height: '100%'
            }}
    >
      <color attach="background" args={["black"]}></color>
      <OrbitControls target={[0, 0, 0]} />
      <Stars radius={100} depth={1} count={5000} factor={4} saturation={0} 
        // fade
      /> 
      {/* <CustomStars ></CustomStars> */}
      {/* <Cloud /> */}
      {/* <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.5} /> */}
      
      <spotLight position={[10, 15, 10]} angle={0.3}></spotLight>
      <ambientLight intensity={0.5} />
      <mesh>
        <sphereGeometry attach="geometry" args={[1000, 16, 16]}/>
        <meshStandardMaterial attach="material"
                    color={"black"}
      
                    />
      </mesh>
      <LargeBox />
    </Canvas>
  )
};


export default Scene
