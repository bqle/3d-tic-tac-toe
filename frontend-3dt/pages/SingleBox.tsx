import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, MeshProps, ThreeEvent, useFrame, Vector3 } from '@react-three/fiber'
import {GameStatus} from '../enums/GameStatus'
import SnowFlake from './Snowflake'

type SingleBoxProps = JSX.IntrinsicElements['mesh'] & {
  boxStatus? : GameStatus
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

    const hover = (e : ThreeEvent<PointerEvent>)=> {e.stopPropagation(); setHover(true)}
    const unhover = (e : ThreeEvent<PointerEvent>) => {e.stopPropagation(); setHover(false)}

    function handleClick(e: ThreeEvent<MouseEvent>) {
        e.stopPropagation();
        if (updateHighlightCoord) {updateHighlightCoord!()}
    }

    return (
      <group position = {meshProps.position!}>
        <mesh 
          // position={meshProps.position!}
          onPointerOver={hover}
          onPointerOut={unhover}
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
          boxStatus! === GameStatus.O &&
          <mesh
            // position={meshProps.position!}
            >
            <sphereGeometry attach='geometry' args={[0.4, 30, 30]} />
            <meshStandardMaterial attach="material"
                      color={'#debd3c'}
                      // transparent={true}
                      // opacity={0.7}
                      />
          </mesh>
        }
        {
          boxStatus! === GameStatus.X &&
          <SnowFlake />
        }
      </group>
    )
  }

export default SingleBox