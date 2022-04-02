import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, MeshProps, ThreeEvent, useFrame } from '@react-three/fiber'
import {GameStatus} from '../enums/GameStatus'

type SingleBoxProps = JSX.IntrinsicElements['mesh'] & {
  boxStatus? : GameStatus
  highlightStatus? : boolean
  updateHighlightArray? : any
}


const SingleBox = ({
  boxStatus,
  highlightStatus,
  updateHighlightArray,
  ...meshProps
}:SingleBoxProps) => {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    const hover = (e : ThreeEvent<PointerEvent>)=> {e.stopPropagation(); setHover(true)}
    const unhover = (e : ThreeEvent<PointerEvent>) => {e.stopPropagation(); setHover(false)}

    function handleClick(e: ThreeEvent<MouseEvent>) {
        e.stopPropagation();
        if (updateHighlightArray) {updateHighlightArray!()}
    }

    // useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
    return (
      <mesh
        {...meshProps}
        ref={mesh}
        onPointerOver={hover}
        onPointerOut={unhover}
        onClick={handleClick}
        >
        <boxGeometry attach="geometry" />
        <meshStandardMaterial attach="material"
                    color={highlightStatus ? "hotpink" : "#debd3c"}
                    transparent={true}
                    opacity={active ? 0.4 : 0.2}
                    />
      </mesh>
    )
  }

export default SingleBox