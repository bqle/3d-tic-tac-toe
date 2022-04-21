
import * as THREE from 'three'
import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import {colors} from '../public/constants'

type CustomStarsProps= {
  count?: number,
  distance? : number
}

function random_gaussian() {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

const CustomStars = (props: CustomStarsProps) => {
    let group : any = useRef();
    let theta = 0;
    useFrame(() => {
      if (group.current) {
        const r = 5 * Math.sin(THREE.MathUtils.degToRad((theta += 0.01)));
        const s = Math.cos(THREE.MathUtils.degToRad(theta * 2));
        group.current.rotation.set(r, r, r);
        group.current.scale.set(s, s, s);
      }
    });
  
    const dist = props.distance! ? props.distance! : 300;
    const [geo, mat, coords] = useMemo(() => {
      const geo = new THREE.SphereBufferGeometry(0.7, 10, 10);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colors.lightYellow)
      });
      const coords = new Array(props.count! ? props.count! : 2000) 
        .fill(null)
        .map(i => {
          // R is final distance away
          const R = (Math.random() * 0.55 + 0.45) * dist; // a near-1 fraction of distance
          let x = random_gaussian() * R;
          let y = random_gaussian() * R;
          let z = random_gaussian() * R;
          let normalize = Math.sqrt(x*x + y*y + z*z)
          x = x / normalize * R;
          y = y / normalize * R;
          z = z / normalize * R;
          return [x , y, z]});
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