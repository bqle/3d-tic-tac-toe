
import * as THREE from 'three'
import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'


function CustomStars() {
    let group : any = useRef();
    let theta = 0;
    // useFrame(() => {
    //   if (group.current) {
          
    //     // Some things maybe shouldn't be declarative, we're in the render-loop here with full access to the instance
    //     const r = 5 * Math.sin(THREE.MathUtils.degToRad((theta += 0.01)));
    //     const s = Math.cos(THREE.MathUtils.degToRad(theta * 2));
    //     group.current.rotation.set(r, r, r);
    //     group.current.scale.set(s, s, s);
    //   }
    // });
  
    const [geo, mat, coords] = useMemo(() => {
      const geo = new THREE.SphereBufferGeometry(1, 10, 10);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("yellow")
      });
      const coords = new Array(1000)
        .fill(null)
        .map(i => [
          Math.random() * 800 - 400,
          Math.random() * 800 - 400,
          Math.random() * 800 - 400
        ]);
      return [geo, mat, coords];
    }, []);
  
    return (
      <group ref={group}>
        {coords.map(([p1, p2, p3], i) => (
          <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
        ))}
      </group>
    );
  }

export default CustomStars