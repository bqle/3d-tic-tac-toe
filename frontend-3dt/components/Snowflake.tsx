import * as THREE from 'three'
import React, { useRef } from 'react'
import { MeshProps, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'

const lineWidth = 2
const low = -0.3
const high = 0.3
const color = '#955342'

const SnowFlake = (meshProps:MeshProps) => {
    const group = useRef<THREE.Mesh>(null!)


    // useFrame(() => {group.current.rotation.x = group.current.rotation.x + 0.01;
    //     group.current.rotation.y = group.current.rotation.y + 0.01
    
    // })

    useFrame(({clock}) => {
        const a = clock.getElapsedTime()
        group.current.rotation.x = Math.sin(a)
        group.current.rotation.y = Math.sin(a)
        group.current.rotation.z = a
    })
    
    return (
        <group ref={group} position={[0, 0, 0]}>
            <Line
                points={[[low, low, low], [high, high, high]]}
                color={color}
                lineWidth={lineWidth}
                alphaWrite
            />
            <Line
                points={[[high, low, low], [low, high, high]]}
                color={color}
                lineWidth={lineWidth}
                alphaWrite
            />
            <Line
                points={[[low, high, low], [high, low, high]]}
                color={color}
                lineWidth={lineWidth}
                alphaWrite
            />
            <Line
                points={[[low, low, high], [high, high, low]]}
                color={color}
                lineWidth={lineWidth}
                alphaWrite
            />

        </group>
    )
  }

export default SnowFlake