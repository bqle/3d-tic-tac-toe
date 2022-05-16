import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, MeshProps, ThreeEvent, useFrame, Vector3, extend } from '@react-three/fiber'
import {SquareStatus} from '../enums/SquareStatus'
import SnowFlake from './Snowflake'
import {useSpring, config, animated} from '@react-spring/three'


type SingleBoxProps = JSX.IntrinsicElements['mesh'] & {
  boxStatus? : SquareStatus
  highlightStatus? : boolean
  updateHighlightCoord? : any
}


const SingleBox = ({
  boxStatus,
  highlightStatus,
  updateHighlightCoord,
  ...meshProps
}:SingleBoxProps) => {
    const [hovered, setHover] = useState(false)
    const [status, setBoxStatus] = useState(SquareStatus.EMPTY)

    const {scale} = useSpring({
      scale: hovered ? 1 : 0,
      config: config.wobbly,
    })


    function handleClick(e: ThreeEvent<MouseEvent>) {
        e.stopPropagation();
        if (updateHighlightCoord) {updateHighlightCoord!()}
    }

    useMemo(() => {
      if (boxStatus != SquareStatus.EMPTY) {
        setHover(true)
      } else {
        setHover(false)
      }
    }, [boxStatus])

    useEffect(() => {
      const handleEnter = (e: KeyboardEvent) => {
        if (e.code === "Enter" && highlightStatus!) {
          console.log("single box", meshProps.position!)
          setHover(true)
        }
      }
      window.addEventListener('keydown', handleEnter);
      return () => {
        window.removeEventListener('keydown', handleEnter);
      };
    })
    

    return (
      <group position = {meshProps.position!}>
        <mesh 
          
          // onPointerOver={hover}
          // onPointerOut={unhover}
          onClick={handleClick}
          >
          <boxGeometry attach='geometry' />
          <meshStandardMaterial attach='material'
                      color={highlightStatus ? "hotpink" : "#debd3c"}
                      transparent={true}
                      opacity={highlightStatus ? 0.4 : 0.1}
                      />
        </mesh>
        {
          boxStatus! === SquareStatus.O &&
          <animated.mesh
            scale={scale}
            >
            <sphereGeometry attach='geometry' args={[0.25, 30, 30]} />
            <meshStandardMaterial attach="material"
                      color={'#debd3c'}/>
          </animated.mesh>
        }
        {
          boxStatus! === SquareStatus.X &&
          <animated.mesh scale={scale}><SnowFlake /></animated.mesh>
        }
      </group>
    )
  }

export default SingleBox