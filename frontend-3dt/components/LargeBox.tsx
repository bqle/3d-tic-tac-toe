import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import * as THREE from 'three'
import SingleBox from './SingleBox'
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
  const [nextTile, setNextTile] = useState(GameStatus.X)

  const [gameStatus, setGameStatus] = useState([[[GameStatus.EMPTY, GameStatus.EMPTY, GameStatus.EMPTY],
                                                 [GameStatus.EMPTY, GameStatus.EMPTY, GameStatus.EMPTY],
                                                 [GameStatus.EMPTY, GameStatus.EMPTY, GameStatus.EMPTY]],
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
    } else if (code === 'Enter') {
      console.log('ENTER!')
      let gameStatusClone = new Array(3).fill(0).map(() => new Array(3).fill(0).map(() => new Array(3).fill(0)))
      for (let i = 0 ; i < 3; i++) {
        for (let j = 0 ; j < 3; j++) {
          for (let k = 0 ; k < 3 ; k++) {
            gameStatusClone[i][j][k] = gameStatus[i][j][k];
          }
        }
      }
      if (gameStatusClone[i][j][k] === GameStatus.EMPTY) {
        console.log('EMPTY!')
        gameStatusClone[i][j][k] = nextTile
        if (nextTile === GameStatus.O) {
          setNextTile(GameStatus.X)
        } else {
          setNextTile(GameStatus.O)  
        }
        setGameStatus(gameStatusClone)
      }
    }
  }, [highlightCoord, gameStatus, nextTile])
  
  const clickCenter = useCallback(event => {
    setHighlightCoord([1, 1, 1]);
  }, [])

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
                  <SingleBox key={i + ' ' + j + ' ' + k} position={[i - boxSize * shiftFactor, j - boxSize * shiftFactor, k - boxSize * shiftFactor]}
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

export default LargeBox