import * as THREE from 'three'
import React, { useLayoutEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

import { ReactThreeFiber, extend } from '@react-three/fiber'

extend({ Line_: THREE.Line })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
    }
  }
}

<line_ ... />

type LineProps = {
    start: Array<number>,
    end: Array<number>
}

function Line(props: LineProps) {
    function LinePath(props) {
        const vertices = ...
      
        const ref = useUpdate(geometry => {
          geometry.setFromPoints(vertices)
        }, [])
      
        return (
          <line>
            <bufferGeometry attach="geometry" ref={ref} />
            <lineBasicMaterial attach="material" color="white" />
          </line>
        )
      }
}

export default Line