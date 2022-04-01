import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber'


function SingleBox(props: JSX.IntrinsicElements['mesh']) {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    const hover = (e : ThreeEvent<PointerEvent>)=> {e.stopPropagation(); setHover(true)}
    const unhover = (e : ThreeEvent<PointerEvent>) => {e.stopPropagation(); setHover(false)}

    function handleClick(e: ThreeEvent<MouseEvent>) {
        e.stopPropagation();
        setActive(!active)
    }

    // useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
    return (
      <mesh
        {...props}
        ref={mesh}
        onPointerOver={hover}
        onPointerOut={unhover}
        onClick={handleClick}
        // scale={active ? 1.5 : 1}
        >
        <boxGeometry attach="geometry" />
        <meshStandardMaterial attach="material"
                    color={active ? "hotpink" : "#debd3c"
                        
                            }
                    transparent={true}
                    opacity={active ? 0.4 : 0.2}
                    />
      </mesh>
    )
  }

export default SingleBox